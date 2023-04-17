<?php

namespace App\Services\Modules\ServiceOrder;

use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\ServiceOrders\ServiceOrderIncidentRepository;

class ServiceOrderIncidentService implements ServiceInterface
{
    private ServiceOrderIncidentRepository $repository;

    public function __construct(ServiceOrderIncidentRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getPaginate(string $limit, string $page, string $search)
    {
        return $this->repository->getPaginate($limit, $page, $search);
    }

    public function createOne(array $data)
    {
        $data["date"] = date("Y-m-d", strtotime($data["date"]));

        $incident = $this->repository->createOne($data);

        return response(["message" => "Incidente criado com sucesso!"], 201);
    }

    public function updateOne(array $data, string $identifier)
    {
        $incident = $this->repository->updateOne($data, $identifier);

        return response(["message" => "Incidente atualizado com sucesso!"], 200);
    }

    public function delete(array $ids)
    {
        $incident = $this->repository->delete($ids);

        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
