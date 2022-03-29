<?php

namespace App\Http\Controllers\modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Model utilizado
use App\Models\Plans\FlightPlansModel;
use App\Models\Incidents\IncidentsModel;
use App\Models\Reports\ReportsModel;

class FlightPlansModuleController extends Controller
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
        
        $model = new FlightPlansModel();

        $request_values = explode("/", request()->args);

        $offset = isset($request_values[0]) ? $request_values[0] : 0;
        $limit = isset($request_values[1]) ? $request_values[1] : 100;

        $response = $model->loadAllFlightPlans((int) $offset, (int) $limit);

        if($response["status"] && !$response["error"]){
    
            $dataFormated = $this->plansTableFormat($response["data"], $limit);

            return response(["status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$response["status"] && $response["error"]){

            return response(["status" => false, "error" => $response->content()], 500);

        }  

    }

    /**
     * Função para formatação dos dados para o painel de planos de vôo
     * Os dados são tratados e persistidos em uma matriz
     * 
     *
     * @param object $data
     * @return array
     */
    private function plansTableFormat(array $data, int $limit) : array {

        $arrData = [];

        foreach($data["selectedRecords"] as $row => $object){
            
            // Geração da estrutura com os dados preparados para uso no front-end
            $arrData[$row] = array(
                "plan_id" => $object->id,
                "report_id" => $object->id_relatorio,
                "incident_id" => $object->id_incidente,
                "plan_file" => $object->arquivo,
                "plan_description" => $object->descricao,
                "plan_status" => $object->status,
                "created_at" => $object->dh_criacao,
                "updated_at" => $object->dh_atualizacao
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
     * Função para processar rotinas que complementam os formulários do plano de vôo
     * A variável $wich_table pode ser "incidents" ou "reports"
     *
     * @return \Illuminate\Http\Response
     */
    public function create() : \Illuminate\Http\Response
    {

        try{

            $table = request()->data_source;

            $data = DB::table($table)->get();

            return response($data, 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()]);

        }

    }

    /**
     * Função para processar a requisição da criação de um registro de plano
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) : \Illuminate\Http\Response
    {
        
        $model = new FlightPlansModel();

        $model_response = $model->newFlightPlan($request->except("auth"));

        if($model_response["status"] && !$model_response["error"]){

            return response(["error" => $response["error"]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $response["error"]], 500);

        }

    }

    /**
     * Função para buscar um ou mais registros de planos pesquisados
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function show($request) : \Illuminate\Http\Response
    {
        
        $model = new FlightPlansModel();

        $request_values = explode(".", request()->args);

        $value_searched = $request_values[0];
        $offset = $request_values[1];
        $limit = $request_values[2];

        $model_response = $model->loadSpecificFlightPlans($value_searched, (int) $offset, (int) $limit);
    
        if($model_response["status"] && !$model_response["error"]){

            $dataFormated = $this->plansTableFormat($model_response["data"], $limit);

            return response(["records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }  

    }

    /**
     * Função para processar a atualização de um registro de plano
     * 
     * MÉTODO: PATCH
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) : \Illuminate\Http\Response
    {
        
        $model = new FlightPlansModel();

        $model_response = $model->updateFlightPlan((int) $id, $request->except("auth"));

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }
    }

    /**
     * Função para processar a remoção de um registro de plano
     * 
     * MÉTODO: DELETE
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {

        $model = new FlightPlansModel();

        $model_response = $model->deleteFlightPlan((int) $id);

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }

    }
}
