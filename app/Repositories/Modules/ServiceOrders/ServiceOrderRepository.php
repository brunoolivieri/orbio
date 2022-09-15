<?php

namespace App\Repositories\Modules\ServiceOrders;

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

            $service_order = $this->serviceOrderModel->create($data->only(["start_date", "end_date", "number", "observation", "status"])->all());

            $service_order->users()->attach($creator->id, ['role' => "creator"]);
            $service_order->users()->attach($pilot->id, ['role' => "pilot"]);
            $service_order->users()->attach($client->id, ['role' => "client"]);

            // Create each many to many record through an array of ids
            $service_order->flight_plans()->attach($data->get('flight_plans_ids'));

            return $service_order;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        return DB::transaction(function () use ($data, $identifier) {

            $service_order = $this->serviceOrderModel->findOrFail($identifier);
            $pilot = $this->userModel->findOrFail($data->get('pilot_id'));
            $client = $this->userModel->findOrFail($data->get('client_id'));

            $service_order->update($data->only(["start_date", "end_date", "observation", "status"])->all());

            $service_order->users()->attach($pilot->id, ['role' => "pilot"]);
            $service_order->users()->attach($client->id, ['role' => "client"]);

            // Create each many to many record through an array of ids
            // Any IDs that are not in the given array will be removed from the intermediate table
            $service_order->flight_plans()->sync($data->get('flight_plans_ids'));

            return $service_order;
        });
    }

    function deleteOne(string $identifier)
    {
        $service_order = $this->serviceOrderModel->findOrFail($identifier);

        $service_order->delete();

        return $service_order;
    }
}
