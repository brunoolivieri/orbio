<?php

namespace App\Http\Controllers\Modules\ServiceOrder;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
// Custom
use App\Models\Orders\ServiceOrderModel;
use App\Models\Pivot\ServiceOrderHasUserModel;
use App\Models\Pivot\ServiceOrderHasFlightPlanModel;
use App\Models\User\UserModel;
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderStoreRequest;
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderUpdateRequest;
use App\Events\Modules\Orders\OrderCreatedEvent;
use App\Events\Modules\Orders\OrderUpdatedEvent;
use App\Events\Modules\Orders\OrderDeletedEvent;
use App\Services\FormatDataService;

class ServiceOrderModuleController extends Controller
{

    private FormatDataService $format_data_service;
    private ServiceOrderModel $service_order_model;

    /**
     * Dependency injection.
     * 
     * @param App\Services\FormatDataService $service
     * @param App\Models\Orders\ServiceOrderModel $service_order
     */
    public function __construct(FormatDataService $service, ServiceOrderModel $service_order){
        $this->format_data_service = $service;
        $this->service_order_model = $service_order;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model_response = $this->service_order_model->loadServiceOrdersWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->format_data_service->serviceOrderPanelDataFormatting($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('service_orders_error')->info("[Método: Index][Controlador: ReportModuleController] - Nenhum registro de ordem de serviço encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('service_orders_error')->error("[Método: Store][Controlador: ReportModuleController] - Falha na criação da ordem de serviço - Erro: ".$model_response["error"]);

            return response(["error" => $model_response["error"]], 500);

        }  
    }

    /**
     * Get data to fill the select inputs that exists in create and update formulary 
     *
     * @return \Illuminate\Http\Response
     */
    public function create() : \Illuminate\Http\Response
    {
        $where = isset(request()->where) ? explode(".", request()->where) : false;
        $select = explode(".", request()->select_columns);

        try{

            $data = DB::table(request()->table)->when( $where, function($query, $where){

                $query->where($where[0], $where[1])
                ->where("deleted_at", null);

            })->select($select[0], $select[1])->get();

            return response($data, 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()]);

        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param App\Http\Requests\Modules\ServiceOrders\ServiceOrderStoreRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(ServiceOrderStoreRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        try{

            DB::transaction(function () use ($request) {

                $pilot = UserModel::findOrFail($request->pilot_id);
                $client = UserModel::findOrFail($request->client_id);

                $new_service_order = ServiceOrderModel::create(
                    [
                        "start_date" => $request->start_date,
                        "end_date" => $request->end_date,
                        "numOS" => "os.".time(),
                        "creator_name" => Auth::user()->name,
                        "pilot_name" => $pilot->name,
                        "client_name" => $client->name,
                        "observation" => $request->observation,
                        "status" => $request->status
                    ]
                );

                ServiceOrderHasUserModel::insert([
                    ["service_order_id" => $new_service_order->id,"user_id" => Auth::user()->id], 
                    ["service_order_id" => $new_service_order->id,"user_id" => $request->pilot_id],
                    ["service_order_id" => $new_service_order->id,"user_id" => $request->client_id]
                ]);

                $arr_plans_ids = json_decode($request->fligth_plans_ids, true);

                foreach($arr_plans_ids as $i => $value){
                    foreach($value as $j => $plan_id){

                        ServiceOrderHasFlightPlanModel::insert([
                            "service_order_id" => $new_service_order->id,
                            "flight_plan_id" => $plan_id
                        ]);

                    }
                }

                event(new OrderCreatedEvent([
                    "initial_date" => $request->initial_date,
                    "final_date" =>  $request->final_date,
                    "creator" => [
                        "name" => Auth::user()->name,
                        "email" => Auth::user()->email
                    ],
                    "pilot" => [
                        "name" => $pilot->name,
                        "email" => $pilot->email
                    ],
                    "client" => [
                        "name" => $client->name,
                        "email" => $client->email
                    ],
                    "observation" => $request->observation
                ]));

            });

            Log::channel('service_orders_action')->info("[Método: Store][Controlador: ReportModuleController] - Ordem de serviço criada com sucesso");

            return response("", 200);

        }catch(\Exception $e){

            DB::rollBack();

            Log::channel('service_orders_error')->error("[Método: Store][Controlador: ReportModuleController] - Falha na criação da ordem de serviço - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }

    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) : \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_read');
        
        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model_response = $this->service_order_model->loadServiceOrdersWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            if($model_response["data"]->total() > 0){

                $data_formated = $this->format_data_service->serviceOrderPanelDataFormatting($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('service_orders_error')->error("[Método: Show][Controlador: ReportModuleController] - Nenhum registro encontrado na pesquisa");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('service_orders_error')->error("[Método: Show][Controlador: ReportModuleController] - Erro: ".$model_response["error"]);

            return response(["error" => $model_response["error"]], 500);

        }  
        
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\ServiceOrders\ServiceOrderUpdateRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(ServiceOrderUpdateRequest $request, $id) : \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        try{

            DB::beginTransaction();

            $pilot_data = UserModel::find($request->pilot_id);
            $client_data = UserModel::find($request->client_id);

            // Update da ordem de serviço
            $order = ServiceOrderModel::where('id', $id)->update(
                [
                    "start_date" => $request->start_date,
                    "end_date" => $request->end_date,
                    "creator_name" => Auth::user()->name,
                    "pilot_name" => $pilot_data->name,
                    "client_name" => $client_data->name,
                    "observation" => $request->observation,
                    "status" => $request->status
                ]
            );

            // Deleta as relações atuais com os usuários - é mais fácil desse modo
            ServiceOrderHasUserModel::where("service_order_id", $id)->delete();
            // Cria novamente as relações com cada usuário envolvido na ordem de serviço (criador, piloto e cliente)
            ServiceOrderHasUserModel::insert([
                ["service_order_id" => (int) $id,"user_id" => Auth::user()->id], 
                ["service_order_id" => (int) $id,"user_id" => $request->pilot_id],
                ["service_order_id" => (int) $id,"user_id" => $request->client_id]
            ]);

             // Deleta as relações atuais com os planos de vôo - é mais fácil desse modo
             ServiceOrderHasFlightPlanModel::where("service_order_id", $id)->delete();
            // Cria novamente as relações com cada plano de vôo envolvido na ordem de serviço
            $arr_plans_ids = json_decode($request->fligth_plans_ids, true);
            foreach($arr_plans_ids as $i => $value){
                foreach($value as $j => $plan_id){

                    ServiceOrderHasFlightPlanModel::insert([
                        "service_order_id" => (int) $id,
                        "flight_plan_id" => (int) $plan_id
                    ]);

                }
            }

            //event(new OrderUpdatedEvent($order));

            Log::channel('service_orders_action')->info("[Método: Update][Controlador: ReportModuleController] - Ordem de serviço atualizada com sucesso - ID da ordem de serviço: ".$id);

            DB::Commit();

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('service_orders_error')->error("[Método: Update][Controlador: ReportModuleController] - Falha na atualização da ordem de serviço - Erro: ".$e->getMessage());

            DB::rollBack();

            return response(["error" => $e->getMessage()], 500);

        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');
        
        try{

            DB::BeginTransaction();

            $service_order = ServiceOrderModel::find($id);

            // Desvinculation with flight_plans through service_order_has_flight_plan table
            if(!empty($service_order->service_order_has_flight_plan)){ 
                $service_order->service_order_has_flight_plan()->delete();
            }

            // Desvinculation with user through service_order_has_user table
            $service_order->service_order_has_user()->delete();

            $service_order->delete();

            //event(new OrderDeletedEvent($service_order));

            Log::channel('service_orders_action')->info("[Método: Destroy][Controlador: ReportModuleController] - Ordem de serviço removido com sucesso - ID da ordem de serviço: ".$id);

            DB::Commit();

            return response("", 200);

        }catch(\Exception $e){

            DB::rollBack();

            Log::channel('service_orders_error')->error("[Método: Destroy][Controlador: ReportModuleController] - Falha na remoção da ordem de serviço - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }
    }
}
