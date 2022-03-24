<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Model utilizado
use App\Models\Incidents\IncidentsModel;

class IncidentsModuleController extends Controller
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

        $response = $model->loadAllIncidents((int) $offset, (int) $limit);

        if($response["status"] && !$response["error"]){
    
            $dataFormated = $this->incidentsTableFormat($response["data"], $limit);

            //dd($dataFormated);

            return response(["status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$response["status"] && $response["error"]){

            return response(["status" => false, "error" => $response->content()], 500);

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

            // O tratamento do formato das datas é realizado no frontend, com a lib moment.js, para evitar erros 
            $incident_date_formated = date( 'd-m-Y h:i', strtotime($object->dh_incidente));
            
            $arrData[$row] = array(
                "incident_id" => $object->id,
                "incident_type" => $object->tipo_incidente,
                "description" => $object->descricao,
                "incident_date" => $incident_date_formated
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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
        $model = new IncidentsModel();

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

        $registrationData = [
    
        ];

        $response = $model->newIncident($registrationData);

         if($response["status"]){

            return response(["status" => $response["status"], "error" => $response["error"]], 200);

        }else{

            return response(["status" => $response["status"], "error" => $response["error"]], 500);

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

        $response = $model->loadSpecificIncidents($value_searched, (int) $offset, (int) $limit);
    
        if($response["status"] && !$response["error"]){

            $dataFormated = $this->incidentsTableFormat($response["data"], $limit);

            return array("status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]);

        }else if(!$response["status"] && $response["error"]){

            return array("status" => false, "error" => $response["error"]);

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
        
        $model = new IncidentsModel();

        $updateData = [
            
        ];

        $update = $model->updateIncident((int) $request->id, $updateData);

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

    }
}
