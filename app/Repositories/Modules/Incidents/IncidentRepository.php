<?php

namespace App\Repositories\Modules\Incidents;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
// Model
use App\Models\Incidents\Incident;
use App\Models\FlightPlans\FlightPlan;

class IncidentRepository implements RepositoryInterface
{
    public function __construct(Incident $incidentModel, FlightPlan $flightPlanModel)
    {
        $this->incidentModel = $incidentModel;
        $this->flightPlanModel = $flightPlanModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->incidentModel->where("deleted_at", null)
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page_number));
    }

    function createOne(Collection $data)
    {

        return DB::transaction(function () use ($data) {

            $incident = $this->incidentModel->create($data->only(["type", "date", "description"])->all());

            if ($data->get('flight_plan_id') != "0") {
                $this->flightPlanModel->where("id", $data->get("flight_plan_id"))->update([
                    "incident_id" => $incident->id
                ]);
            }

            return $incident;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        $incident = $this->incidentModel->findOrFail($identifier);

        $incident->update($data->only(["type", "date", "description"])->all());

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
