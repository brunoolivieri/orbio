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
        $incident = $this->incidentModel->create([
            "type" => $data->get("type"),
            "date" => $data->get("date"),
            "description" => $data->get("description")
        ]);

        return $incident;
    }

    function updateOne(Collection $data, string $identifier)
    {
        $incident = $this->incidentModel->findOrFail($identifier);

        $incident->update([
            "type" => $data->get("type"),
            "date" => $data->get("date"),
            "description" => $data->get("description")
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
