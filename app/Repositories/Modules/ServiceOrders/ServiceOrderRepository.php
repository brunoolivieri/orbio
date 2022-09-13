<?php

namespace App\Repositories\Modules\Administration;;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
// Models
use App\Models\Users\User;
use App\Models\ServiceOrders\ServiceOrder;

class ServiceOrderRepository implements RepositoryInterface
{
    public function __construct(User $userModel, ServiceOrder $serviceOrderModel)
    {
        $this->userModel = $userModel;
        $this->serviceOrderModel = $serviceOrderModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->serviceOrderModel::with("users")
            ->with("flight_plans")
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page_number);
    }

    function createOne(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $creator = $this->userModel->findOrFail(Auth::user()->id);
            $pilot = $this->userModel->findOrFail($data->get('pilot_id'));
            $client = $this->userModel->findOrFail($data->get('client_id'));

            $new_service_order = $this->serviceOrderModel->create($data->only(["start_date", "end_date", "number", "observation", "status"]));

            $this->serviceOrder->users->insert([
                [
                    "user_id" => $creator->id,
                    "service_order_id" => $new_service_order->id,
                    "role" => "creator"
                ],
                [
                    "user_id" => $pilot->id,
                    "service_order_id" => $new_service_order->id,
                    "role" => "pilot"
                ],
                [
                    "user_id" => $client->id,
                    "service_order_id" => $new_service_order->id,
                    "role" => "client"
                ]
            ]);

            foreach ($data->get('flight_plans_ids') as $flight_plan_id) {

                $this->serviceOrder->users->insert([
                    "service_order_id" => $new_service_order->id,
                    "flight_plan_id" => $flight_plan_id
                ]);
            }

            return $new_service_order;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        return DB::transaction(function () use ($data, $identifier) {

            $service_order = $this->serviceOrderModel->findOrFail($identifier);
            $pilot = $this->userModel->findOrFail($data->get('pilot_id'));
            $client = $this->userModel->findOrFail($data->get('client_id'));

            $service_order->update($data->only(["start_date", "end_date", "observation", "status"]));

            // Update service order pilot
            $this->serviceOrder->users->where("role", "pilot")->update(
                [
                    "user_id" => $pilot->id
                ]
            );

            // Update service order client
            $this->serviceOrder->users->where("role", "client")->update(
                [
                    "user_id" => $client->id
                ]
            );

            // Delete related flight plans
            $this->ServiceOrder->flight_plans->where("service_order_id", $service_order->id)->delete();

            // Create again the relationship with flight plans
            foreach ($data->get('flight_plans_ids') as $flight_plan_id) {
                $this->ServiceOrder->flight_plans->insert([
                    "service_order_id" => (int) $service_order->id,
                    "flight_plan_id" => (int) $flight_plan_id
                ]);
            }

            return $service_order;
        });
    }

    function deleteOne(string $identifier)
    {
        $service_order = $this->serviceOrderModel->find($identifier);

        $service_order->delete();

        return $service_order;
    }
}
