<?php

namespace App\Services\Modules\Incident;

use Illuminate\Http\Request;
// Custom
use App\Models\Incidents\IncidentModel;
use App\Http\Resources\Modules\Incidents\IncidentsPanelResource;

class IncidentService
{

    /**
     * Dependency injection.
     * 
     * @param App\Models\FlightPlans\FlightPlanModel $flight_plan_model
     * @param App\Models\Reports\ReportModel $report_model
     * @param App\Models\Pivot\ServiceOrderHasFlightPlanModel $service_order_has_flight_plan_model
     */
    public function __construct(IncidentModel $incident_model)
    {
        $this->incident_model = $incident_model;
    }

    /**
     * Load all incidents with pagination.
     *
     * @param int $limit
     * @param int $actual_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, string $order_by, int $page_number, int|string $search, int|array $filters)
    {

        $data = $this->incident_model->where("deleted_at", null)
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);

        if ($data->total() > 0) {
            return response(new IncidentsPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum incidente encontrado."], 404);
        }
    }

    /**
     * Create incident.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request)
    {

        $this->incident_model->create($request->only(["type", "date", "description"]));

        return response(["message" => "Incidente criado com sucesso!"], 200);
    }

    /**
     * Update incident.
     *
     * @param  \Illuminate\Http\Request $request
     * @param int $incident_id
     * @return \Illuminate\Http\Response
     */
    public function updateResource(Request $request, int $incident_id)
    {

        $this->incident_model->where('id', $incident_id)->update($request->only(["type", "description", "date"]));

        return response(["message" => "Incidente atualizado com sucesso!"], 200);
    }

    /**
     * Soft delete incident.
     *
     * @param int $incident_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $incident_id)
    {

        $this->incident_model->where('id', $incident_id)->delete();

        return response(["message" => "Incidente deletado com sucesso!"], 200);
    }
}
