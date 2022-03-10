<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Model utilizado
use Models\Reports\ReportsModel;

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

        $request_values = explode("|", request()->args);

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
    private function reportsTableFormat(object $data, int $limit) : array {

        return [];

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
            "dh_inicio_voo" => $request->flight_start_date,
            "dh_fim_voo" => $request->flight_end_date,
            "log_voo" => $request->flight_log,
            "observacao" => $request->flight_note
        ];

        $response = $model->newReport($registrationData);

         // Se o registro foi realizado com sucesso
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
     * @param string $request
     * @return array
     */
    public function show($request) : array
    {

        $model = new ReportsModel();

        // Os valores da string enviada via URL são obtidos
        $request_values = explode("|", $request);

        // Isolamento dos valores da requisição em variáveis
        $panel = $request_values[0];
        $value_searched = $request_values[1];
        $offset = $request_values[2];
        $limit = $request_values[3];

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
            "dh_inicio_voo" => $request->flight_start_date,
            "dh_fim_voo" => $request->flight_end_date,
            "log_voo" => $request->flight_log,
            "observacao" => $request->flight_note
        ];

        $update = $model->updateReportData((int) $request->id,  $updateData);

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
    public function destroy(Request $request, $param) : \Illuminate\Http\Response
    {
        
        $model = new ReportsModel();

        $id = $param;

        $delete = $model->deleteReport($id);

        if($delete["status"]){

            return response("", 200);

        }else{

            return response("", 500);

        }
 
    }
}
