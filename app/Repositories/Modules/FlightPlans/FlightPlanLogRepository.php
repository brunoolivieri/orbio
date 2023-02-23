<?php

namespace App\Repositories\Modules\FlightPlans;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
use Exception;
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
            ->search($search) // scope
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page);
    }

    function createOne(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $log = $this->logModel->create([
                "name" => $data->get("name"),
                "filename" => $data->get("filename"),
                "path" => $data->get("file_storage")["path"],
                "timestamp" => date("Y-m-d H:i:s", $data->get("timestamp"))
            ]);

            Storage::disk('public')->put($data->get("file_storage")["path"], $data->get("file_storage")["contents"]);

            if ($data->get("is_valid") && !is_null($data->get("image_storage"))) {

                $log->image()->create([
                    "path" => $data->get("image_storage")["path"]
                ]);

                Storage::disk('public')->put($data->get("image_storage")["path"], $data->get("image_storage")["contents"]);
            }

            return $log;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        $log = $this->logModel->findOrFail($identifier);

        $log->update([
            "name" => $data->get("name")
        ]);

        $log->refresh();

        return $log;
    }

    function delete(array $ids)
    {
        return DB::transaction(function () use ($ids) {

            $undeleteable_ids = [];
            foreach ($ids as $log_id) {

                $log = $this->logModel->findOrFail($log_id);

                if ($log->service_order_flight_plan) {

                    $log_service_order = $this->serviceOrderModel->where("id", $log->service_order_flight_plan->service_order_id)->where("status", true)->first();

                    if ($log_service_order->status) {
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
