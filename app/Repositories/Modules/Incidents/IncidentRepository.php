<?php

namespace App\Repositories\Modules\Incidents;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Collection;
// Model
use App\Models\Incidents\Incident;
use App\Models\FlightPlans\FlightPlan;

class IncidentRepository implements RepositoryInterface
{
    public function __construct(Incident $incidentModel)
    {
        $this->incidentModel = $incidentModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->incidentModel
            ->with("flight_plan")
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page_number));
    }

    function createOne(Collection $data)
    {

        $incident = $this->incidentModel->create($data->only(["type", "date", "description", "flight_plan_id"])->all());

        return $incident;
    }

    function updateOne(Collection $data, string $identifier)
    {
        $incident = $this->incidentModel->findOrFail($identifier);

        $incident->update($data->only(["type", "date", "description", "flight_plan_id"])->all());

        $incident->refresh();

        return $incident;
    }

    function deleteOne(string $identifier)
    {
        $incident = $this->incidentModel->findOrFail($identifier);

        $incident->delete();

        return $incident;
    }
}
