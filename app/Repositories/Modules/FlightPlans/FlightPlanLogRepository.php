<?php

namespace App\Repositories\Modules\FlightPlans;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
// Model
use App\Models\Logs\Log;
use App\Models\Pivot\ServiceOrderFlightPlan;

class FlightPlanLogRepository implements RepositoryInterface
{
    public function __construct(Log $logModel, ServiceOrderFlightPlan $serviceOrderFlightPlanModel)
    {
        $this->logModel = $logModel;
        $this->serviceOrderFlightPlanModel = $serviceOrderFlightPlanModel;
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
        DB::transaction(function () use ($data) {

            $log = $this->logModel->create([
                "name" => $data->get("name"),
                "filename" => $data->get("filename"),
                "path" => $data->get("path"),
                "timestamp" => $data->get("timestamp")
            ]);

            Storage::disk('public')->put($data->get("path"), $data->get('file_content'));
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        $log = $this->logModel->findOrFail($identifier);

        $service_order_flight_plan = $this->serviceOrderFlightPlanModel->where("service_order_id", $data->get("service_order_id"))->where("flight_plan_id", $data->get("flight_plan_id"))->firstOrFail();

        $log->update([
            "name" => $data->get("name"),
            "service_order_flight_plan_id" => $service_order_flight_plan->id
        ]);

        $log->refresh();

        return $log;
    }

    function delete(array $ids)
    {
        foreach ($ids as $log_id) {

            $log = $this->logModel->findOrFail($log_id);

            $log->delete();
        }

        return $log;
    }
}
