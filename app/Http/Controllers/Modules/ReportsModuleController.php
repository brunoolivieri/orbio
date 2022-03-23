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

        $request_values = explode("/", request()->args);

        $offset = $request_values[0];
        $limit = $request_values[1];

        $response = $model->loadAllReports((int) $offset, (int) $limit);

        if($response["status"] && !$response["error"]){
    
            $dataFormated = $this->reportsTableFormat($response["data"], $limit);

            return response(["status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$response["status"] && $response["error"]){

            return response(["status" => false, "error" => $response->content()], 500);

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
            $created_at_formated = $object->dh_criacao;
            $updated_at_formated = $object->dh_atualizacao === NULL ? "Sem dados" : $object->dh_atualizacao;
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
     * Função para composição do formulário de criação de registro de relatório
     * 
     * MÉTODO: GET
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

        //$panel = request()->panel;

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

        $registrationData = [
            "flight_start_date" => $request->flight_start,
            "flight_end_date" => $request->flight_end,
            "flight_log" => $request->flight_log,
            "report_note" => $request->report_note
        ];

        $response = $model->newReport($registrationData);

         if($response["status"]){

            return response(["status" => $response["status"], "error" => $response["error"]], 200);

        }else{

            return response(["status" => $response["status"], "error" => $response["error"]], 500);

        }

    }

     /**
     * Função para mostrar um ou mais registros de relatório pesquisados
     * 
     * MÉTODO: GET
     *
     * @param $request
     * @return array
     */
    public function show($request) : array
    {

        $model = new ReportsModel();

        $request_values = explode(".", request()->args);

        $value_searched = $request_values[0];
        $offset = $request_values[1];
        $limit = $request_values[2];

        $response = $model->loadSpecificReports($value_searched, (int) $offset, (int) $limit);
    
        if($response["status"] && !$response["error"]){

            $dataFormated = $this->reportsTableFormat($response["data"], $limit);

            return array("status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]);

        }else if(!$response["status"] && $response["error"]){

            return array("status" => false, "error" => $response["error"]);

        }  
    }

    /**
     * Show the form for editing the specified resource.
     * 
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        

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

        $updateData = [
            "dh_inicio_voo" => $request->flight_start,
            "dh_fim_voo" => $request->flight_end,
            "log_voo" => $request->flight_log,
            "observacao" => $request->report_note
        ];

        $update = $model->updateReport((int) $request->id, $updateData);

        if($update["status"] && !$update["error"]){

            return response("", 200);

        }else if(!$update["status"] && $update["error"]){

            return response(["error" => $update["error"]], 500);

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

        $delete = $model->deleteReport((int) $id);

        if($delete["status"]){

            return response("", 200);

        }else{

            return response("", 500);

        }
 
    }
}
