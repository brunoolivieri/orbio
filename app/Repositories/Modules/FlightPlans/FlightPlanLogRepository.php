<?php

namespace App\Repositories\Modules\FlightPlans;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Logs\Log;
use App\Models\Pivot\ServiceOrderFlightPlan;
use App\Models\ServiceOrders\ServiceOrder;

class FlightPlanLogRepository implements RepositoryInterface
{
    public function __construct(Log $logModel, ServiceOrderFlightPlan $serviceOrderFlightPlanModel, ServiceOrder $serviceOrderModel)
    {
        $this->logModel = $logModel;
        $this->serviceOrderFlightPlanModel = $serviceOrderFlightPlanModel;
        $this->serviceOrderModel = $serviceOrderModel;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->logModel
            ->with("service_order_flight_plan")
            ->withTrashed()
            ->search($search) // scope
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page);
    }

    function createOne(array $data)
    {
        return DB::transaction(function () use ($data) {

            $log = $this->logModel->create($data["log"]);

            Storage::disk('public')->put($data["log"]["path"], $data["contents"]["log"]);

            if (!is_null($log->image_path)) {
                Storage::disk('public')->put($log->image_path, $data["contents"]["image"]);
            }

            return $log;
        });
    }

    function updateOne(array $data, string $id)
    {
        $log = $this->logModel->withTrashed()->findOrFail($id);

        $log->update([
            "name" => $data["name"]
        ]);

        if ($log->trashed() && $data["undelete"]) {
            $log->restore();
        }

        $log->refresh();

        return $log;
    }

    function delete(array $ids)
    {
        return DB::transaction(function () use ($ids) {

            $undeleteable_ids = [];
            foreach ($ids as $log_id) {

                $log = $this->logModel->findOrFail($log_id);

                if ($log->service_order_flight_plan()->exists()) {

                    $log_service_order = $this->serviceOrderModel->where("id", $log->service_order_flight_plan->service_order_id)->where("status", true)->first();

                    if ((bool) $log_service_order->status) {
                        array_push($undeleteable_ids, $log->id);
                    }
                }
            }

            if (count($undeleteable_ids) === 0) {
                $this->logModel->delete("id", $ids);
            }

            return $undeleteable_ids;
        });
    }
}
