<?php

namespace App\Services\Modules\Incident;

// Contracts
use App\Services\Contracts\ServiceInterface;
// Repository
use App\Repositories\Modules\Incidents\IncidentRepository;
// Resouce
use App\Http\Resources\Modules\Incidents\IncidentsPanelResource;

class IncidentService implements ServiceInterface
{
    public function __construct(IncidentRepository $incidentRepository)
    {
        $this->repository = $incidentRepository;
    }

    public function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        $data = $this->repository->getPaginate($limit, $order_by, $page_number, $search, $filters);

        if ($data->total() > 0) {
            return response(new IncidentsPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum incidente encontrado."], 404);
        }
    }

    public function createOne(array $data)
    {
        $data["date"] = date("Y-m-d", strtotime($data["date"]));

        $incident = $this->repository->createOne(collect($data));

        return response(["message" => "Incidente criado com sucesso!"], 201);
    }

    public function updateOne(array $data, string $identifier)
    {
        $incident = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Incidente atualizado com sucesso!"], 200);
    }

    public function deleteOne(string $identifier)
    {
        $incident = $this->repository->deleteOne($identifier);

        return response(["message" => "Incidente deletado com sucesso!"], 200);
    }
}
