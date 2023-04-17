<?php

namespace App\Repositories\Modules\ServiceOrders;

use App\Repositories\Contracts\RepositoryInterface;
use App\Models\Incidents\Incident;

class ServiceOrderIncidentRepository implements RepositoryInterface
{
    private Incident $incidentModel;

    public function __construct(Incident $incidentModel)
    {
        $this->incidentModel = $incidentModel;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->incidentModel
            ->search($search) // scope
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));
    }

    function createOne(array $data)
    {
        $incident = $this->incidentModel->create([
            "type" => $data["type"],
            "date" => $data["date"],
            "description" => $data["description"]
        ]);

        return $incident;
    }

    function updateOne(array $data, string $id)
    {
        $incident = $this->incidentModel->findOrFail($id);

        $incident->update([
            "type" => $data["type"],
            "date" => $data["date"],
            "description" => $data["description"]
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
