<?php

namespace App\Http\Controllers\Modules\ServiceOrder;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Orders\ServiceOrdersModel;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

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
    
            $data_formated = $this->serviceOrdersTableFormat($model_response["data"], $limit);

            return response($data_formated, 200);

        }else if(!$model_response["status"] && $model_response["error"]){

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
    private function serviceOrdersTableFormat(LengthAwarePaginator $data) : array {

        $arr_with_formated_data = [];

        foreach($data->items() as $row => $record){

            // O tratamento do formato das datas é realizado no frontend, com a lib moment.js, para evitar erros 
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) : \Illuminate\Http\Response
    {

        $request->validate([
            "dh_inicio" => 'required|date',
            "dh_fim" => 'required|date',
            "numOS" => 'required|string',
            "nome_criador" => 'required|string',
            "nome_piloto" => 'required|string',
            "nome_cliente" => 'required|string',
            "observacao" => 'required|string',
            "status" => 'required|boolean',
            "id_plano_voo" => 'required|integer',
        ]);

        try{

            ServiceOrdersModel::create($request->except("auth"));

            return response("", 200);

        }catch(\Exception $e){

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
    
            $data_formated = $this->serviceOrdersTableFormat($model_response["data"], $limit);

            return response($data_formated, 200);

        }else if(!$model_response["status"] && $model_response["error"]){

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
    public function update(Request $request, $id) : \Illuminate\Http\Response
    {

        $request->validate([
            "dh_inicio" => 'required|date',
            "dh_fim" => 'required|date',
            "numOS" => 'required|string',
            "nome_criador" => 'required|string',
            "nome_piloto" => 'required|string',
            "nome_cliente" => 'required|string',
            "observacao" => 'required|string',
            "status" => 'required|boolean',
            "id_plano_voo" => 'required|integer',
        ]);

        try{

            ServiceOrdersModel::where('id', $id)->update($request->except("auth"));

            return response("", 200);

        }catch(\Exception $e){

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

            ServiceOrdersModel::where('id', $id)->delete();

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);

        }
    }
}
