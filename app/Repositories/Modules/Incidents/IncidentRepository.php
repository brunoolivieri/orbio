<?php

namespace App\Repositories\Modules\Incidents;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Collection;
// Model
use App\Models\Incidents\Incident;
use App\Models\FlightPlans\FlightPlan;
use App\Models\Pivot\ServiceOrderFlightPlan;

class IncidentRepository implements RepositoryInterface
{
    public function __construct(Incident $incidentModel, ServiceOrderFlightPlan $flightPlanServiceOrderModel)
    {
        $this->incidentModel = $incidentModel;
        $this->flightPlanServiceOrderModel = $flightPlanServiceOrderModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->incidentModel
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page_number));
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

        return response(["message" => "Incidente criado com sucesso!"], 201);
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

        return response(["message" => "Incidente atualizado com sucesso!"], 200);
    }

    function deleteOne(string $identifier)
    {
        $incident = $this->incidentModel->findOrFail($identifier);

        $incident->delete();

        return response(["message" => "Incidente deletado com sucesso!"], 200);
    }
}
