<?php

namespace App\Services\Modules\ServiceOrder;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
// Models
use App\Models\Users\User;
use App\Models\ServiceOrders\ServiceOrder;
use App\Models\Pivot\ServiceOrderUser;
use App\Models\Pivot\ServiceOrderFlightPlan;
// Resources
use App\Http\Resources\Modules\ServiceOrders\ServiceOrdersPanelResource;
// Contracts
use App\Contracts\ServiceInterface;

class ServiceOrderService implements ServiceInterface
{

    /**
     * Dependency injection.
     * 
     * @param App\Models\Users\User $userModel
     * @param App\Models\ServiceOrders\ServiceOrder $serviceOrderModel
     * @param App\Models\Pivot\ServiceOrderUser $ServiceOrderUser
     * @param App\Models\Pivot\ServiceOrderFlightPlan $ServiceOrderFlightPlan
     */
    public function __construct(User $userModel, ServiceOrder $serviceOrderModel, ServiceOrderUser $ServiceOrderUser, ServiceOrderFlightPlan $ServiceOrderFlightPlan)
    {
        $this->userModel = $userModel;
        $this->serviceOrderModel = $serviceOrderModel;
        $this->ServiceOrderUser = $ServiceOrderUser;
        $this->ServiceOrderFlightPlan = $ServiceOrderFlightPlan;
    }

    /**
     * Load all service orders with pagination.
     *
     * @param int $limit
     * @param int $actual_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, string $order_by, int $page_number, int|string $search, int|array $filters): \Illuminate\Http\Response
    {

        $data = $this->serviceOrderModel->where("deleted_at", null)
            ->with("users")
            ->with("flight_plans")
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);

        if ($data->total() > 0) {
            return response(new ServiceOrdersPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhuma ordem de serviço encontrada."], 404);
        }
    }

    /**
     * Create service order.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request) {

            $creator = $this->userModel->findOrFail(Auth::user()->id);
            $pilot = $this->userModel->findOrFail($request->pilot_id);
            $client = $this->userModel->findOrFail($request->client_id);

            $new_service_order = $this->serviceOrderModel->create(
                [
                    "start_date" => $request->start_date,
                    "end_date" => $request->end_date,
                    "number" => "os." . time(),
                    "observation" => $request->observation,
                    "status" => $request->boolean("status")
                ]
            );

            $this->ServiceOrderUser->create([
                "service_order_id" => $new_service_order->id,
                "creator_id" => $creator->id,
                "pilot_id" => $pilot->id,
                "client_id" => $client->id
            ]);

            foreach ($request->flight_plans_ids as $value) {

                $this->ServiceOrderFlightPlan->insert([
                    "service_order_id" => $new_service_order->id,
                    "flight_plan_id" => $value
                ]);
            }
        });

        return response(["message" => "Ordem de serviço criada com sucesso!"], 200);
    }

    /**
     * Update service order.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $service_order_id
     * @return \Illuminate\Http\Response
     */
    public function updateResource(Request $request, int $service_order_id): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request, $service_order_id) {

            $service_order = $this->serviceOrderModel->findOrFail($service_order_id);
            $creator = $this->userModel->findOrFail($service_order->users->has_creator->id);
            $pilot = $this->userModel->findOrFail($request->pilot_id);
            $client = $this->userModel->findOrFail($request->client_id);

            $service_order->update(
                [
                    "start_date" => $request->start_date,
                    "end_date" => $request->end_date,
                    "observation" => $request->observation,
                    "status" => $request->boolean("status")
                ]
            );

            // Desvinculation with all users through service_order_has_user table
            $service_order->users()->delete();

            $this->ServiceOrderUser->create([
                "service_order_id" => $service_order->id,
                "creator_id" => $service_order->users->has_creator->id,
                "pilot_id" => $pilot->id,
                "client_id" => $client->id
            ]);

            // Deleta as relações atuais com os planos de vôo 
            $this->ServiceOrderFlightPlan->where("service_order_id", $service_order->id)->delete();

            // Cria novamente as relações com cada plano de vôo envolvido na ordem de serviço
            foreach ($request->flight_plans_ids as $index => $flight_plan_id) {
                $this->ServiceOrderFlightPlan->insert([
                    "service_order_id" => (int) $service_order->id,
                    "flight_plan_id" => (int) $flight_plan_id
                ]);
            }

            $service_order = $this->serviceOrderModel->findOrFail($service_order_id);
        });

        return response(["message" => "Ordem de serviço atualizada com sucesso!"], 200);
    }

    /**
     * Soft delete service order.
     *
     * @param int $service_order_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $service_order_id): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($service_order_id) {

            $service_order = $this->serviceOrderModel->find($service_order_id);

            // Desvinculation with all flight plans through service_order_has_flight_plans table
            if ($service_order->flight_plans->count() > 0) {
                $this->ServiceOrderFlightPlan->where("service_order_id", $service_order->id)->delete();
            }

            // Desvinculation with all users through service_order_has_user table
            $this->ServiceOrderUser->where("service_order_id", $service_order->id)->delete();

            $service_order->delete();
        });

        return response(["message" => "Ordem de serviço deletada com sucesso!"], 200);
    }
}
