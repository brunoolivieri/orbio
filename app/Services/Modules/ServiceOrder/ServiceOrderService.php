<?php

namespace App\Services\Modules\ServiceOrder;

// Repository
use App\Repositories\Modules\ServiceOrders\ServiceOrderRepository;
// Resources
use App\Http\Resources\Modules\ServiceOrders\ServiceOrdersPanelResource;
// Contracts
use App\Contracts\ServiceInterface;
// Events
use App\Events\Modules\ServiceOrder\{
    ServiceOrderCreatedEvent,
    ServiceOrderUpdatedEvent,
    ServiceOrderDeletedEvent
};

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
            return response(new ServiceOrdersPanelResource($data));
        } else {
            return response(["message" => "Nenhuma ordem de serviço encontrada."], 404);
        }
    }

    public function createResource(array $data)
    {
        $data["number"] = "os" . time();
        $data["status"] = boolval(intval($data["status"]));

        $service_order = $this->repository->createOne(collect($data));

        ServiceOrderCreatedEvent::dispatch($service_order);

        return response(["message" => "Ordem de serviço criada com sucesso!"], 201);
    }

    public function updateResource(array $data, string $identifier)
    {

        // Change, if its "0", each equipment value for null
        foreach ($data["flight_plans"] as $index => $flight_plan) {
            foreach ($flight_plan as $key => $value) {
                if ($value === "0") {
                    $data["flight_plans"][$index][$key] = null;
                }
            }
        }

        $service_order = $this->repository->updateOne(collect($data), $identifier);

        ServiceOrderUpdatedEvent::dispatch($service_order);

        return response(["message" => "Ordem de serviço atualizada com sucesso!"], 200);
    }

    public function deleteResource(string $identifier)
    {
        $service_order = $this->repository->deleteOne($identifier);

        ServiceOrderDeletedEvent::dispatch($service_order);

        return response(["message" => "Ordem de serviço deletada com sucesso!"], 200);
    }
}
