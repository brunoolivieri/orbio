<?php

namespace App\Repositories\Modules\Incidents;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Collection;
// Model
use App\Models\Incidents\Incident;
use App\Models\Pivot\ServiceOrderFlightPlan;

class IncidentRepository implements RepositoryInterface
{
    public function __construct(Incident $incidentModel, ServiceOrderFlightPlan $flightPlanServiceOrderModel)
    {
        $this->incidentModel = $incidentModel;
        $this->flightPlanServiceOrderModel = $flightPlanServiceOrderModel;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->incidentModel
            ->search($search) // scope
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));
    }

    function createOne(Collection $data)
    {
        $service_order_flight_plan = $this->flightPlanServiceOrderModel->where("service_order_id", $data->get("service_order_id"))->where("flight_plan_id", $data->get("flight_plan_id"))->first();

        $incident = $this->incidentModel->create([
            "type" => $data->get("type"),
            "date" => $data->get("date"),
            "description" => $data->get("description"),
            "service_order_flight_plan_id" => $service_order_flight_plan->id
        ]);

        return $incident;
    }

    function updateOne(Collection $data, string $identifier)
    {
        $incident = $this->incidentModel->findOrFail($identifier);

        $service_order_flight_plan = $this->flightPlanServiceOrderModel->where("service_order_id", $data->get("service_order_id"))->where("flight_plan_id", $data->get("flight_plan_id"))->first();

        $incident->update([
            "type" => $data->get("type"),
            "date" => $data->get("date"),
            "description" => $data->get("description"),
            "service_order_flight_plan_id" => $service_order_flight_plan->id
        ]);

        $incident->refresh();

        return $incident;
    }

    function delete(array $ids)
    {
        foreach ($ids as $incident_id) {

            $incident = $this->incidentModel->findOrFail($incident_id);

            $incident->delete();
        }

        return $incident;
    }
}
