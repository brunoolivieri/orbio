<?php

namespace App\Repositories\Modules\ServiceOrders;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
// Models
use App\Models\Users\User;
use App\Models\ServiceOrders\ServiceOrder;
use App\Models\Incidents\Incident;

class ServiceOrderRepository implements RepositoryInterface
{
    public function __construct(User $userModel, ServiceOrder $serviceOrderModel, Incident $incidentModel)
    {
        $this->userModel = $userModel;
        $this->serviceOrderModel = $serviceOrderModel;
        $this->incidentModel = $incidentModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->serviceOrderModel::with("users")
            ->with("flight_plans")
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page_number);
    }

    function createOne(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            // ==== Create service order ==== //

            $service_order = $this->serviceOrderModel->create([
                "uuid" => Str::uuid(),
                "start_date" => date("Y-m-d", strtotime($data->get("start_date"))),
                "end_date" => date("Y-m-d", strtotime($data->get("end_date"))),
                "number" => $data->get("number"),
                "observation" => $data->get("observation"),
                "status" => $data->get("status"),
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

            // ==== Update service order ==== //

            $service_order = $this->serviceOrderModel->findOrFail($identifier);
            $service_order->update($data->only(["start_date", "end_date", "observation", "status"])->all());

            // ==== Update service order users relationship ==== //

            $pilot = $this->userModel->findOrFail($data->get('pilot_id'));
            $client = $this->userModel->findOrFail($data->get('client_id'));

            $service_order->users()->sync([
                [$pilot->id => ['role' => "pilot"]],
                [$client->id => ['role' => "client"]]
            ]);

            // ==== Update service order flight plans relationship ==== //

            // Get only ids from selected flight plans - they will be necessary later
            $new_flight_plans_ids = [];
            foreach ($data->get('flight_plans') as $index => $flight_plan) {
                $new_flight_plans_ids[$index] = $flight_plan["id"];
            }

            // If any flight plan with incidents has changed, delete it, because a incident just exists related to a flight plan in a service order
            // Deletion of unselected flight plan and its incidents
            foreach ($service_order->flight_plans as $index => $stored_flight_plan) {

                // If the flight plan id not exists in array of ids of new flight plans
                if (!in_array($stored_flight_plan->id, $new_flight_plans_ids)) {

                    // Thus, the flight plan was unselected in this service order and the related incidents need to be deleted
                    // After the pivot relation will be deleted with "sync" method
                    $this->incidentModel->where("service_order_flight_plan_id", $stored_flight_plan->pivot->id)->forceDelete();
                }
            }

            foreach ($data->get('flight_plans') as $flight_plan) {

                $flight_plan_id = $flight_plan["id"];
                $equipments_by_id = ["drone_id" => $flight_plan["drone_id"], "battery_id" => $flight_plan["battery_id"], "equipment_id" => $flight_plan["equipment_id"]];

                $service_order->flight_plans()->sync([$flight_plan_id => $equipments_by_id]);
            }

            return $service_order;
        });
    }

    function deleteOne(string $identifier)
    {
        $service_order = $this->serviceOrderModel->findOrFail($identifier);

        $service_order->delete();

        return $service_order;
    }
}
