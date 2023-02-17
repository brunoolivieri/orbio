<?php

namespace App\Repositories\Modules\ServiceOrders;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use Exception;
use App\Models\Users\User;
use App\Models\ServiceOrders\ServiceOrder;
use App\Models\Incidents\Incident;
use App\Models\Logs\Log;

class ServiceOrderRepository implements RepositoryInterface
{
    public function __construct(User $userModel, ServiceOrder $serviceOrderModel, Incident $incidentModel, Log $logModel)
    {
        $this->userModel = $userModel;
        $this->serviceOrderModel = $serviceOrderModel;
        $this->incidentModel = $incidentModel;
        $this->logModel = $logModel;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->serviceOrderModel::with("flight_plans", "users")
            ->search($search) // scope
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page);
    }

    function createOne(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            // ==== Create service order ==== //

            $service_order = $this->serviceOrderModel->create([
                "start_date" => date("Y-m-d", strtotime($data->get("start_date"))),
                "end_date" => date("Y-m-d", strtotime($data->get("end_date"))),
                "number" => $data->get("number"),
                "observation" => $data->get("observation"),
                "report_id" => null
            ]);

            // ==== Attach service order to the correspondent users ==== //

            $creator = $this->userModel->findOrFail(Auth::user()->id);
            $pilot = $this->userModel->findOrFail($data->get('pilot_id'));
            $client = $this->userModel->findOrFail($data->get('client_id'));

            $service_order->users()->attach($creator->id, ['role' => "creator"]);
            $service_order->users()->attach($pilot->id, ['role' => "pilot"]);
            $service_order->users()->attach($client->id, ['role' => "client"]);

            // ==== Attach service order the selected flight plans with equipments ==== //

            foreach ($data->get('flight_plans') as $flight_plan) {

                $flight_plan_id = $flight_plan["id"];
                $equipments_by_id = ["drone_id" => $flight_plan["drone_id"], "battery_id" => $flight_plan["battery_id"], "equipment_id" => $flight_plan["equipment_id"]];

                $service_order->flight_plans()->attach($flight_plan_id, $equipments_by_id);
            }

            return $service_order;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        return DB::transaction(function () use ($data, $identifier) {

            // ==== First step: Update service order ==== //

            $service_order = $this->serviceOrderModel->findOrFail($identifier);

            $service_order->update($data->only(["start_date", "end_date", "observation", "status"])->all());

            // ==== Second step: Update service order users relationship ==== //

            $creator = $this->userModel->findOrFail($data->get('creator_id'));
            $pilot = $this->userModel->findOrFail($data->get('pilot_id'));
            $client = $this->userModel->findOrFail($data->get('client_id'));

            $service_order->users()->sync([
                $creator->id, ['role' => "creator"],
                $pilot->id => ['role' => "pilot"],
                $client->id => ['role' => "client"]
            ]);

            // ==== Third step: Detected unselected flight plans and delete its data ==== //

            // Get only ids from new selected flight plans - they will be necessary later
            $new_flight_plans_ids = [];
            foreach ($data->get('flight_plans') as $index => $flight_plan) {
                $new_flight_plans_ids[$index] = $flight_plan["id"];
            }

            // Detect unselected flight plans
            $already_stored_flight_plans_ids = [];
            foreach ($service_order->flight_plans as $index => $stored_flight_plan) {

                // If the stored flight plan id not exists in array of ids of new flight plans was unselected
                if (!in_array($stored_flight_plan->id, $new_flight_plans_ids)) {
                    // Delete all pivot data
                    $this->incidentModel->where("service_order_flight_plan_id", $stored_flight_plan->pivot->id)->forceDelete();
                    $this->logModel->where("service_order_flight_plan_id", $stored_flight_plan->pivot->id)->forceDelete();
                    $stored_flight_plan->pivot->delete();
                }

                // For next step 
                $already_stored_flight_plans_ids[$index] = $stored_flight_plan->id;
            }

            // ==== Fourth step: Create or Update Pivot ==== //

            foreach ($data->get('flight_plans') as $selected_flight_plan) {

                $equipments_by_id = ["drone_id" => $selected_flight_plan["drone_id"], "battery_id" => $selected_flight_plan["battery_id"], "equipment_id" => $selected_flight_plan["equipment_id"]];

                // If selected flight plan id is not already stored 
                if (!in_array($selected_flight_plan["id"], $already_stored_flight_plans_ids)) {
                    // so is really a new one - create new pivot
                    $service_order->flight_plans()->attach($selected_flight_plan["id"], $equipments_by_id);
                } else {
                    // Is not new, just updated it
                    $service_order->flight_plans()->updateExistingPivot($selected_flight_plan["id"], $equipments_by_id);
                }

                // ==== Fifty step: Log relationships ==== //

                $service_order_flight_plan = $service_order->flight_plans()->where("flight_plan_id", $selected_flight_plan["id"])->first();
                $log = $this->logModel->where("service_order_flight_plan_id", $service_order_flight_plan->pivot->id)->first();

                if ($log) {

                    // Pivot have log and have no more 
                    // Pivot have log and now have a different one
                    if (is_null($selected_flight_plan["log_id"])) {
                        $log->update([
                            "service_order_flight_plan_id" => null
                        ]);
                    } else {
                        $log->update(["service_order_flight_plan_id" => null]);

                        $this->logModel->where("id", $selected_flight_plan["log_id"])->update([
                            "service_order_flight_plan_id" => $service_order_flight_plan->pivot->id
                        ]);
                    }
                    
                } else {

                    // Pivot doesnt have log and sent one - log_id not null
                    if (!is_null($selected_flight_plan["log_id"])) {
                        $this->logModel->where("id", $selected_flight_plan["log_id"])->update([
                            "service_order_flight_plan_id" => $service_order_flight_plan->pivot->id
                        ]);
                    }
                }
            }

            $service_order->refresh();

            return $service_order;
        });
    }

    function delete(array $ids)
    {
        foreach ($ids as $service_order_id) {

            $service_order = $this->serviceOrderModel->findOrFail($service_order_id);

            $service_order->delete();
        }

        return $service_order;
    }
}
