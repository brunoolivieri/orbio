<?php

namespace App\Services\Modules\ServiceOrder;

use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\ServiceOrders\ServiceOrderRepository;
use App\Notifications\Modules\ServiceOrder\{
    ServiceOrderCreatedNotification,
    ServiceOrderUpdatedNotification,
    ServiceOrderDeletedNotification
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
        
        // Change, if its "0", each equipment value for null
        foreach ($data["flight_plans"] as $index => $flight_plan) {
            foreach ($flight_plan as $key => $value) {
                if ($value === "0") {
                    $data["flight_plans"][$index][$key] = null;
                }
            }
        }

        $service_order = $this->repository->createOne($data);

        // Send notification to users
        foreach ($service_order->users as $user) {
            if ($user->pivot->role === "creator") {
                $user->notify(new ServiceOrderCreatedNotification($service_order));
            } else if ($user->pivot->role === "pilot") {
                $user->notify(new ServiceOrderCreatedNotification($service_order));
            } else if ($user->pivot->role === "client") {
                $user->notify(new ServiceOrderCreatedNotification($service_order));
            }
        }
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

        $service_order = $this->repository->updateOne($data, $identifier);

        // Send notification to users
        foreach ($service_order->users as $user) {
            if ($user->pivot->role === "creator") {
                $user->notify(new ServiceOrderUpdatedNotification($service_order));
            } else if ($user->pivot->role === "pilot") {
                $user->notify(new ServiceOrderUpdatedNotification($service_order));
            } else if ($user->pivot->role === "client") {
                $user->notify(new ServiceOrderUpdatedNotification($service_order));
            }
        }
    }

    public function delete(array $ids)
    {
        $service_order = $this->repository->delete($ids);

        // Send notification to users
        foreach ($service_order->users as $user) {
            if ($user->pivot->role === "creator") {
                $user->notify(new ServiceOrderDeletedNotification($service_order));
            } else if ($user->pivot->role === "pilot") {
                $user->notify(new ServiceOrderDeletedNotification($service_order));
            } else if ($user->pivot->role === "client") {
                $user->notify(new ServiceOrderDeletedNotification($service_order));
            }
        }
    }
}
