<?php

namespace App\Http\Controllers\Modules\ServiceOrder;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Orders\ServiceOrdersModel;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
// Classes de validação das requisições store/update
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderStoreRequest;
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderUpdateRequest;
// Models
use App\Models\Orders\ServiceOrderHasUserModel;
use App\Models\Orders\ServiceOrderHasFlightPlansModel;
// Log
use Illuminate\Support\Facades\Log;

class ServiceOrderModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new ServiceOrdersModel();

        $model_response = $model->loadServiceOrdersWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

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
     * Função para formatação dos dados para o painel de relatórios
     * Os dados são tratados e persistidos em uma matriz
     * 
     *
     * @param object $data
     * @return array
     */
    private function formatDataForTable(LengthAwarePaginator $data) : array {

        $arr_with_formated_data = [];

        foreach($data->items() as $row => $record){

            $created_at_formated = date( 'd-m-Y h:i', strtotime($record->dh_criacao));
            $updated_at_formated = $record->dh_atualizacao === NULL ? "Sem dados" : date( 'd-m-Y h:i', strtotime($record->dh_atualizacao));
            $order_start_date = $record->dh_inicio === NULL ? "Sem dados" : $record->dh_inicio;
            $order_end_date = $record->dh_fim === NULL ? "Sem dados" : $record->dh_fim;
            
            $arr_with_formated_data["records"][$row] = array(
                "order_id" => $record->id,
                "order_status" => $record->status,
                "flight_plan_id" => $record->id_plano_voo,
                "numOS" => $record->numOS,
                "created_at" => $created_at_formated,
                "updated_at" => $updated_at_formated,
                "order_start_date" => $order_start_date,
                "order_end_date" => $order_end_date,
                "creator_name" => $record->nome_criador,
                "pilot_name" => $record->nome_piloto,
                "client_name" => $record->nome_cliente,
                "order_note" => $record->observacao
            );

        }

        $arr_with_formated_data["total_records_founded"] = $data->total();
        $arr_with_formated_data["records_per_page"] = $data->perPage();
        $arr_with_formated_data["total_pages"] = $data->lastPage();

        return $arr_with_formated_data;

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() : \Illuminate\Http\Response
    {

        try{

            if(request()->table == "flight_plans"){

                $data = DB::table("flight_plans")->get();

            }else if(request()->table == "users"){

                if(request()->content == "pilots_name"){

                    $data = DB::table("users")->where("id_perfil", 3)->select("id", "nome")->get();

                }else if(request()->content == "clients_name"){

                    $data = DB::table("users")->where("id_perfil", 4)->select("id", "nome")->get();

                }

            }

            return response($data, 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()]);

        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ServiceOrderStoreRequest $request) : \Illuminate\Http\Response
    {

        try{

            DB::beginTransaction();

            // Create service order
            $new_service_order_id = DB::table("service_orders")->insertGetId(
                [
                    "dh_inicio" => $request->initial_date,
                    "dh_fim" => $request->final_date,
                    "numOS" => $request->numOS,
                    "nome_criador" => Auth::user()->nome,
                    "nome_piloto" => $request->pilot_name,
                    "nome_cliente" => $request->client_name,
                    "observacao" => $request->observation,
                    "status" => $request->status
                ]
            );

            // Create relation with users
            ServiceOrderHasUserModel::create([
                "id_ordem_servico" => $new_service_order_id,
                "id_usuario" => Auth::user()->id
            ]);

            // Create relations with each flight plan selected
            $flight_plans_selected = explode("|", $request->fligth_plans_ids);
            foreach($flight_plans_selected as $index => $plan_id){
                ServiceOrderHasFlightPlansModel::create([
                    "id_ordem_servico" => $new_service_order_id,
                    "id_plano_voo" => $plan_id
                ]);
            }
           
            DB::commit();

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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) : \Illuminate\Http\Response
    {
        
        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new ServiceOrdersModel();

        $model_response = $model->loadServiceOrdersWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

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
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ServiceOrderUpdateRequest $request, $id) : \Illuminate\Http\Response
    {

        try{

            ServiceOrdersModel::where('id', $id)->update([
                "dh_inicio" => $request->initial_date,
                "dh_fim" => $request->final_date,
                "numOS" => $request->numOS,
                "nome_criador" => $request->creator_name,
                "nome_piloto" => $request->pilot_name,
                "nome_cliente" => $request->client_name,
                "observacao" => $request->observation,
                "status" => $request->status,
                "id_plano_voo" => $request->fligth_plan_id,
            ]);

            Log::channel('service_orders_action')->info("[Método: Update][Controlador: ReportModuleController] - Ordem de serviço atualizada com sucesso - ID da ordem de serviço: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('service_orders_error')->error("[Método: Update][Controlador: ReportModuleController] - Falha na atualização da ordem de serviço - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {
        try{

            DB::BeginTransaction();

            $service_order = ServiceOrdersModel::find($id);

            // Desvinculation with flight_plans through service_order_has_flight_plans table
            if(!empty($service_order->service_order_has_flight_plans)){ 
                $service_order->service_order_has_flight_plans()->delete();
            }

            // Desvinculation with user through service_order_has_user table
            $service_order->service_order_has_user()->delete();

            $service_order->delete();

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
