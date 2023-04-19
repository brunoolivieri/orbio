<?php

namespace App\Repositories\Modules\FlightPlans;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Models\Logs\Log;
use App\Models\FlightPlans\FlightPlan;

class FlightPlanRepository implements RepositoryInterface
{
    public function __construct(FlightPlan $flightPlanModel, Log $logModel)
    {
        $this->flightPlanModel = $flightPlanModel;
        $this->logModel = $logModel;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->flightPlanModel
            ->with(["service_orders"])
            ->withTrashed()
            ->search($search) // scope
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page);
    }

    function createOne(array $data)
    {

        foreach ($data["route_files"] as $flight_file) {
            if (Storage::disk('public')->exists($flight_file["path"])) {
                throw new \Exception("Erro! Esse plano de voo já existe");
            }
        }

        return DB::transaction(function () use ($data) {

            $flight_plan = $this->flightPlanModel->create([
                "creator_id" => Auth::user()->id,
                "name" => Str::random(10),
                "files" => json_encode($data["routes_path"]),
                "coordinates" => $data["coordinates"],
                "state" => $data["state"],
                "city" => $data["city"],
                "description" => null,
                "type" => $data["type"],
                "image_path" => $data["image"]["path"],
                "csv_path" => $data["csv"]["path"]
            ]);

            foreach ($data["route_files"] as $route_file) {
                Storage::disk('public')->put($route_file["path"], $route_file["contents"]);
            }

            Storage::disk('public')->put($data["image"]["path"], $data["image"]["contents"]);
            Storage::disk('public')->put($data["csv"]["path"], $data["csv"]["contents"]);

            return $flight_plan;
        });
    }

    function updateOne(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {

            // Update flight plan itself
            $flight_plan = $this->flightPlanModel->withTrashed()->findOrFail($id);
            $flight_plan->update([
                "name" => $data["name"],
                "description" => $data["description"]
            ]);

            if ($flight_plan->trashed() && $data["undelete"]) {
                $flight_plan->restore();
            }

            $flight_plan->refresh();

            return $flight_plan;
        });
    }

    function delete(array $ids)
    {
        return DB::transaction(function () use ($ids) {

            $undeleteable_ids = [];
            foreach ($ids as $flight_plan_id) {

                $flight_plan =  $this->flightPlanModel->findOrFail($flight_plan_id);

                // Check if user is related to a active service order 
                if ($flight_plan->service_orders()->exists()) {
                    foreach ($flight_plan->service_orders as $service_order) {
                        if ($service_order->status) {
                            array_push($undeleteable_ids, $flight_plan_id);
                        }
                    }
                }
            }

            // Deletion will occur only if all flight plans can be deleted
            if (count($undeleteable_ids) === 0) {
                $flight_plan->whereIn("id", $ids)->delete();
            }

            return $undeleteable_ids;
        });
    }
}
