<?php

namespace App\Services\Modules\ServiceOrder;

// Repository
use App\Repositories\Modules\ServiceOrders\ServiceOrderRepository;
// Resources
use App\Http\Resources\Modules\ServiceOrders\ServiceOrdersPanelResource;
// Contracts
use App\Contracts\ServiceInterface;

class ServiceOrderService implements ServiceInterface
{
    function __construct(ServiceOrderRepository $serviceOrderRepository)
    {
        $this->repository = $serviceOrderRepository;
    }

    public function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        $data = $this->repository->getPaginate($limit, $order_by, $page_number, $search, $filters);

        if ($data->total() > 0) {
            return response(new ServiceOrdersPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum perfil encontrado."], 404);
        }
    }

    public function createResource(array $data)
    {
        $data["number"] = "os".time();
        $data["status"] = boolval(intval($data["status"]));

        $service_order = $this->repository->createOne(collect($data));

        return response(["message" => "Ordem de serviço criada com sucesso!"], 201);
    }

    public function updateResource(array $data, string $identifier)
    {
        $service_order = $this->repository->updateOne(collect($data));

        return response(["message" => "Ordem de serviço atualizada com sucesso!"], 200);
    }

    public function deleteResource(string $identifier)
    {
        $service_order = $this->repository->deleteOne($identifier);

        return response(["message" => "Ordem de serviço deletada com sucesso!"], 200);
    }
}
