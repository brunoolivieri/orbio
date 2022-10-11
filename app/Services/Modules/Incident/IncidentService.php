<?php

namespace App\Services\Modules\Incident;

// Repository
use App\Repositories\Modules\Incidents\IncidentRepository;
// Resouce
use App\Http\Resources\Modules\Incidents\IncidentsPanelResource;
// Interface
use App\Contracts\ServiceInterface;

class IncidentService implements ServiceInterface
{
    public function __construct(IncidentRepository $incidentRepository)
    {
        $this->repository = $incidentRepository;
    }

    public function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        $data = $this->repository->getPaginate($limit, $order_by, $page_number, $search, $filters);

        if ($data->total() > 0) {
            return response(new IncidentsPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum incidente encontrado."], 404);
        }
    }

    public function createResource(array $data)
    {

        $data["date"] = date("Y-m-d", strtotime($data["date"]));

        return $this->repository->createOne(collect($data));
    }

    public function updateResource(array $data, string $identifier)
    {
        return $this->repository->updateOne(collect($data), $identifier);
    }

    public function deleteResource(string $identifier)
    {
        return $this->repository->deleteOne($identifier);
    }
}
