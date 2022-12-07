<?php

namespace App\Services\Modules\ServiceOrder;

// Contracts
use App\Services\Contracts\ServiceInterface;
// Repository
use App\Repositories\Modules\ServiceOrders\ServiceOrderRepository;
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

    public function getPaginate(string $limit, string $page, string $search)
    {
        return $this->repository->getPaginate($limit, $page, $search);
    }

    public function createOne(array $data)
    {
        $data["number"] = "os" . time();
        $data["status"] = boolval(intval($data["status"]));

        // Change, if its "0", each equipment value for null
        foreach ($data["flight_plans"] as $index => $flight_plan) {
            foreach ($flight_plan as $key => $value) {
                if ($value === "0") {
                    $data["flight_plans"][$index][$key] = null;
                }
            }
        }

        $service_order = $this->repository->createOne(collect($data));

        // ServiceOrderCreatedEvent::dispatch($service_order);

        return response(["message" => "Ordem de serviço criada com sucesso!"], 201);
    }

    public function updateOne(array $data, string $identifier)
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

        // ServiceOrderUpdatedEvent::dispatch($service_order);

        return response(["message" => "Ordem de serviço atualizada com sucesso!"], 200);
    }

    public function delete(array $ids)
    {
        $service_order = $this->repository->delete($ids);

        //ServiceOrderDeletedEvent::dispatch($service_order);

        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
