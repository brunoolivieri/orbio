<?php

namespace App\Http\Controllers\Modules\Incident;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Incidents\IncidentsModel;

class IncidentModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $model = new IncidentsModel();

        $request_values = explode("/", request()->args);

        $offset = isset($request_values[0]) ? $request_values[0] : 0;
        $limit = isset($request_values[1]) ? $request_values[1] : 100;

        $model_response = $model->loadAllIncidents((int) $offset, (int) $limit);

        if($model_response["status"] && !$model_response["error"]){
    
            $dataFormated = $this->incidentsTableFormat($model_response["data"], $limit);

            return response(["status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }  
    }

    /**
     * Função para formatação dos dados para o painel de incidentes
     * Os dados são tratados e persistidos em uma matriz
     * 
     *
     * @param object $data
     * @return array
     */
    private function incidentsTableFormat(array $data, int $limit) : array {

        $arrData = [];

        foreach($data["selectedRecords"] as $row => $object){
            
            $arrData[$row] = array(
                "incident_id" => $object->id,
                "incident_type" => $object->tipo_incidente,
                "description" => $object->descricao,
                "incident_date" => $object->dh_incidente
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
        $model = new IncidentsModel();

        $model_response = $model->newIncident($request->except('auth'));

         if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $response["error"]], 500);

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
        $model = new IncidentsModel();

        $request_values = explode(".", request()->args);

        $value_searched = $request_values[0];
        $offset = $request_values[1];
        $limit = $request_values[2];

        $model_response = $model->loadSpecificIncidents($value_searched, (int) $offset, (int) $limit);
    
        if($model_response["status"] && !$model_response["error"]){

            $dataFormated = $this->incidentsTableFormat($model_response["data"], $limit);

            return response(["records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

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
    public function update(Request $request, $id)
    {
        $model = new IncidentsModel();

        $update = $model->updateIncident((int) $id, $request->except('auth'));

        if($update["status"] && !$update["error"]){

            return response("", 200);

        }else if(!$update["status"] && $update["error"]){

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
        $model = new IncidentsModel();

        $model_response = $model->deleteIncident((int) $id);

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }
    }
}
