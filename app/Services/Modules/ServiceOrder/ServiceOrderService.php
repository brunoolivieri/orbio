<?php

namespace App\Services\Modules\ServiceOrder;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
// Custom
use App\Models\User\UserModel;
use App\Models\Orders\ServiceOrderModel;
use App\Models\Pivot\ServiceOrderHasUserModel;
use App\Models\Pivot\ServiceOrderHasFlightPlanModel;
use App\Http\Resources\Modules\ServiceOrders\ServiceOrdersPanelResource;

class ServiceOrderService
{

    /**
     * Dependency injection.
     * 
     * @param App\Models\User\UserModel $user_model
     * @param App\Models\Orders\ServiceOrderModel $service_order_model
     * @param App\Models\Pivot\ServiceOrderHasUserModel $service_order_has_user_model
     * @param App\Models\Pivot\ServiceOrderHasFlightPlanModel $service_order_has_flight_plan_model
     */
    public function __construct(UserModel $user_model, ServiceOrderModel $service_order_model, ServiceOrderHasUserModel $service_order_has_user_model, ServiceOrderHasFlightPlanModel $service_order_has_flight_plan_model)
    {
        $this->user_model = $user_model;
        $this->service_order_model = $service_order_model;
        $this->service_order_has_user_model = $service_order_has_user_model;
        $this->service_order_has_flight_plan_model = $service_order_has_flight_plan_model;
    }

    /**
     * Load all service orders with pagination.
     *
     * @param int $limit
     * @param int $actual_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, string $order_by, int $page_number, int|string $search, int|array $filters)
    {

        $data = $this->service_order_model->where("deleted_at", null)
            ->with("has_users")
            ->with("has_flight_plans")
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
    public function createResource(Request $request)
    {

        DB::transaction(function () use ($request) {

            $creator = $this->user_model->findOrFail(Auth::user()->id);
            $pilot = $this->user_model->findOrFail($request->pilot_id);
            $client = $this->user_model->findOrFail($request->client_id);

            $new_service_order = $this->service_order_model->create(
                [
                    "start_date" => $request->start_date,
                    "end_date" => $request->end_date,
                    "numOS" => "os." . time(),
                    "observation" => $request->observation,
                    "status" => $request->boolean("status")
                ]
            );

            $this->service_order_has_user_model->insert([
                "service_order_id" => $new_service_order->id,
                "creator_id" => $creator->id,
                "pilot_id" => $pilot->id,
                "client_id" => $client->id
            ]);

            foreach ($request->flight_plans_ids as $index => $value) {

                $this->service_order_has_flight_plan_model->insert([
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
    public function updateResource(Request $request, int $service_order_id)
    {

        DB::transaction(function () use ($request, $service_order_id) {

            $service_order = $this->service_order_model->findOrFail($service_order_id);
            $creator = $this->user_model->findOrFail($service_order->has_users->has_creator->id);
            $pilot = $this->user_model->findOrFail($request->pilot_id);
            $client = $this->user_model->findOrFail($request->client_id);

            $service_order->update(
                [
                    "start_date" => $request->start_date,
                    "end_date" => $request->end_date,
                    "observation" => $request->observation,
                    "status" => $request->boolean("status")
                ]
            );

            // Desvinculation with all users through service_order_has_user table
            $service_order->has_users()->delete();

            $this->service_order_has_user_model->create([
                "service_order_id" => $service_order->id,
                "creator_id" => $service_order->has_users->has_creator->id,
                "pilot_id" => $pilot->id,
                "client_id" => $client->id
            ]);

            // Deleta as relações atuais com os planos de vôo 
            $this->service_order_has_flight_plan_model->where("service_order_id", $service_order->id)->delete();

            // Cria novamente as relações com cada plano de vôo envolvido na ordem de serviço
            foreach ($request->flight_plans_ids as $index => $flight_plan_id) {
                $this->service_order_has_flight_plan_model->insert([
                    "service_order_id" => (int) $service_order->id,
                    "flight_plan_id" => (int) $flight_plan_id
                ]);
            }

            $service_order = $this->service_order_model->findOrFail($service_order_id);
        });

        return response(["message" => "Ordem de serviço atualizada com sucesso!"], 200);
    }

    /**
     * Soft delete service order.
     *
     * @param int $service_order_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $service_order_id)
    {

        DB::transaction(function () use ($service_order_id) {

            $service_order = $this->service_order_model->find($service_order_id);

            $creator = $this->user_model->find($service_order->has_users->creator_id);
            $pilot = $this->user_model->find($service_order->has_users->pilot_id);
            $client = $this->user_model->find($service_order->has_users->client_id);

            // Desvinculation with all flight plans through service_order_has_flight_plans table
            if ($service_order->has_flight_plans->count() > 0) {
                $this->service_order_has_flight_plan_model->where("service_order_id", $service_order->id)->delete();
            }

            // Desvinculation with all users through service_order_has_user table
            $this->service_order_has_user_model->where("service_order_id", $service_order->id)->delete();

            $service_order->delete();
        });

        return response(["message" => "Ordem de serviço deletada com sucesso!"], 200);
    }
}
