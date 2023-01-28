<?php

namespace App\Repositories\Modules\FlightPlans;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
use Illuminate\Support\Carbon;
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
                "path" => $data->get("file_storage")["path"] . $data->get("filename"),
                "timestamp" => date("Y-m-d H:i:s", $data->get("timestamp"))
            ]);

            Storage::disk('public')->putFileAs($data->get("file_storage")["path"], $data->get("file_storage")["file"], $data->get("file_storage")["filename"]);

            if ($data->get("is_valid")) {

                $log->image()->create([
                    "path" => $data->get("image_storage")["path"] . $data->get("image_storage")["filename"]
                ]);

                Storage::disk('public')->putFileAs($data->get("image_storage")["path"], $data->get("image_storage")["file"], $data->get("image_storage")["filename"]);
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
        foreach ($ids as $log_id) {

            $log = $this->logModel->findOrFail($log_id);

            $log->delete();
        }

        return $log;
    }
}
