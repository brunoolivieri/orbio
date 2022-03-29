<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Model utilizado
use App\Models\Reports\ReportsModel;

class ReportsModuleController extends Controller
{

    /**
     * Carrega e retorna os dados para compor o painel dos relatórios
     * Para os argumentos do SELECT, é enviada uma query string de nome "args"
     * 
     * MÉTODO: GET
     * 
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {

        $model = new ReportsModel();

        $request_values = explode(".", request()->args);

        $offset = isset($request_values[0]) ? $request_values[0] : 0;
        $limit = isset($request_values[1]) ? $request_values[1] : 100;

        $model_response = $model->loadAllReports((int) $offset, (int) $limit);

        if($model_response["status"] && !$model_response["error"]){
    
            $dataFormated = $this->reportsTableFormat($model_response["data"], $limit);

            return response(["records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response->content()], 500);

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
    private function reportsTableFormat(array $data, int $limit) : array {

        $arrData = [];

        foreach($data["selectedRecords"] as $row => $object){

            // O tratamento do formato das datas é realizado no frontend, com a lib moment.js, para evitar erros 
            $created_at_formated = date( 'd-m-Y h:i', strtotime($object->dh_criacao));
            $updated_at_formated = $object->dh_atualizacao === NULL ? "Sem dados" : date( 'd-m-Y h:i', strtotime($object->dh_atualizacao));
            $flight_start_date = $object->dh_inicio_voo === NULL ? "Sem dados" : $object->dh_inicio_voo;
            $flight_end_date = $object->dh_fim_voo === NULL ? "Sem dados" : $object->dh_fim_voo;
            
            $arrData[$row] = array(
                "report_id" => $object->id,
                "flight_log" => $object->log_voo,
                "report_note" => $object->observacao,
                "created_at" => $created_at_formated,
                "updated_at" => $updated_at_formated,
                "flight_start_date" => $flight_start_date,
                "flight_end_date" => $flight_end_date
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
     * Função para processar a requisição da criação de um registro de relatório
     * Esse registro será um novo relatório
     * 
     * MÉTODO: POST
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) : \Illuminate\Http\Response
    {
        
        $model = new ReportsModel();

        $model_response = $model->newReport($request->except('auth'));

         if($model_response["status"] && !$model_response["error"]){

            return response(["error" => $model_response["error"]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }

    }

     /**
     * Função para mostrar um ou mais registros de relatório pesquisados
     * 
     * MÉTODO: GET
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function show($request) : \Illuminate\Http\Response
    {

        $model = new ReportsModel();

        $request_values = explode(".", request()->args);

        $value_searched = $request_values[0];
        $offset = $request_values[1];
        $limit = $request_values[2];

        $model_response = $model->loadSpecificReports($value_searched, (int) $offset, (int) $limit);
    
        if($model_response["status"] && !$model_response["error"]){

            $dataFormated = $this->reportsTableFormat($model_response["data"], $limit);

            return response(["records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }  
    }

    /**
     * Função para processar a edição de um registro de relatório
     * 
     * MÉTODO: PATCH
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) : \Illuminate\Http\Response
    {
        
        $model = new ReportsModel();

        $model_response = $model->updateReport((int) $id, $request->except('auth'));

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }

    }

    /**
     * Função para processar a remoção de um registro de relatório
     * 
     * MÉTODO: DELETE
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {
        
        $model = new ReportsModel();

        $model_response = $model->deleteReport((int) $id);

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }
 
    }
}
