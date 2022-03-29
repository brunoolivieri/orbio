<?php

namespace App\Http\Controllers\modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Model utilizado
use App\Models\Orders\ServiceOrdersModel;

class ServiceOrdersModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        $model = new ServiceOrdersModel();

        $request_values = explode("/", request()->args);

        $offset = isset($request_values[0]) ? $request_values[0] : 0;
        $limit = isset($request_values[1]) ? $request_values[1] : 100;

        $model_response = $model->loadAllServiceOrders((int) $offset, (int) $limit);

        if($model_response["status"] && !$model_response["error"]){
    
            $dataFormated = $this->ordersTableFormat($model_response["data"], $limit);

            return response(["records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

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
    private function ordersTableFormat(array $data, int $limit) : array {

        $arrData = [];

        foreach($data["selectedRecords"] as $row => $object){

            // O tratamento do formato das datas é realizado no frontend, com a lib moment.js, para evitar erros 
            $created_at_formated = date( 'd-m-Y h:i', strtotime($object->dh_criacao));
            $updated_at_formated = $object->dh_atualizacao === NULL ? "Sem dados" : date( 'd-m-Y h:i', strtotime($object->dh_atualizacao));
            $order_start_date = $object->dh_inicio === NULL ? "Sem dados" : $object->dh_inicio;
            $order_end_date = $object->dh_fim === NULL ? "Sem dados" : $object->dh_fim;
            
            $arrData[$row] = array(
                "order_id" => $object->id,
                "order_status" => $object->status,
                "flight_plan_id" => $object->id_plano_voo,
                "numOS" => $object->numOS,
                "created_at" => $created_at_formated,
                "updated_at" => $updated_at_formated,
                "order_start_date" => $order_start_date,
                "order_end_date" => $order_end_date,
                "creator_name" => $object->nome_criador,
                "pilot_name" => $object->nome_piloto,
                "client_name" => $object->nome_cliente,
                "order_note" => $object->observacao
            );

        }

        // O total de registros existentes é menor ou igual a LIMIT? Se sim, existirá apenas uma página
        // Se não, se o total de registros existentes é maior do que LIMT, e sua divisão por LIMIT tem resto zero, o total de páginas será igual ao total de registros dividido por LIMIT (Exemplo: 30 / 10 = 3)
        // Se não, se o total de registros, maior do LIMIT, dividido por LIMIT tem resto maior do que zero, o total de páginas será igual ao total de registros arredondado para cima e dividido por LIMIT (Exemplo: 15 -> 20 / 10 = 2)
        $totalPages = $data["referencialValueForCalcPages"] <= $limit ? 1 : ($data["referencialValueForCalcPages"] % $limit === 0 ? $data["referencialValueForCalcPages"] / $limit : ceil($data["referencialValueForCalcPages"] / $limit));

        $ret = [(int) $totalPages, $arrData];

        return $ret;

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        $model = new ServiceOrdersModel();

        $registrationData = [
            "id_plano_voo" => $request->flight_plan,
            "numOS" => $request->order_numos,
            "dh_inicio" => $request->order_start,
            "dh_fim" => $request->order_end,
            "status" => $request->order_status,
            "nome_criador" => $request->creator_name,
            "nome_piloto" => $request->pilot_name,
            "nome_cliente" => $request->client_name,
            "observacao" => $request->order_note,   
        ];

        $model_response = $model->newServiceOrder($registrationData);

         if($model_response["status"] && !$model_response["error"]){

            return response(["error" => $model_response["error"]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
        $model = new ServiceOrdersModel();

        $request_values = explode(".", request()->args);

        $value_searched = $request_values[0];
        $offset = $request_values[1];
        $limit = $request_values[2];

        $model_response = $model->loadSpecificServiceOrders($value_searched, (int) $offset, (int) $limit);
    
        if($model_response["status"] && !$model_response["error"]){

            $dataFormated = $this->ordersTableFormat($model_response["data"], $limit);

            return response(["records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }  

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        
        $model = new ServiceOrdersModel();

        $updateData = [
            "id_plano_voo" => $request->flight_plan,
            "numOS" => $request->order_numos,
            "dh_inicio" => $request->order_start,
            "dh_fim" => $request->order_end,
            "status" => $request->order_status,
            "nome_criador" => $request->creator_name,
            "nome_piloto" => $request->pilot_name,
            "nome_cliente" => $request->client_name,
            "observacao" => $request->order_note,   
        ];

        $model_response = $model->updateServiceOrder((int) $request->id, $updateData);

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $update["error"]], 500);

        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        
        $model = new ServiceOrdersModel();

        $model_response = $model->deleteServiceOrder((int) $id);

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if($model_response["status"] && !$model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }

    }
}
