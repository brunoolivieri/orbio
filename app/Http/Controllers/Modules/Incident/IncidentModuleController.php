<?php

namespace App\Http\Controllers\Modules\Incident;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Incidents\IncidentsModel;
use Illuminate\Pagination\LengthAwarePaginator;

// Classes de validação das requisições store/update
use App\Http\Requests\Modules\Incidents\IncidentStoreRequest;
use App\Http\Requests\Modules\Incidents\IncidentUpdateRequest;

class IncidentModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new IncidentsModel();

        $model_response = $model->loadIncidentsWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            $data_formated = $this->incidentsTableFormat($model_response["data"], $limit);

            return response($data_formated, 200);

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
    private function incidentsTableFormat(LengthAwarePaginator $data) : array {

        $arr_with_formated_data = [];

        foreach($data->items() as $row => $record){
            
            $arr_with_formated_data["records"][$row] = array(
                "incident_id" => $record->id,
                "incident_type" => $record->tipo_incidente,
                "description" => $record->descricao,
                "incident_date" => $record->dh_incidente
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
     * @param  App\Http\Requests\Modules\Incidents\IncidentStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(IncidentStoreRequest $request)
    {
        try{

            IncidentsModel::create([
                "tipo_incidente" => $request->incident_type,
                "descricao" => $request->description,
                "dh_incidente" => $request->incident_date
            ]);

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
    public function show($id)
    {
        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new IncidentsModel();

        $model_response = $model->loadIncidentsWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            $data_formated = $this->incidentsTableFormat($model_response["data"], $limit);

            return response($data_formated, 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  App\Http\Requests\Modules\Incidents\IncidentUpdateRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(IncidentUpdateRequest $request, $id)
    {
        try{

            IncidentsModel::where('id', $id)->update([
                "tipo_incidente" => $request->incident_type,
                "descricao" => $request->description,
                "dh_incidente" => $request->incident_date
            ]);

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 200);

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
        try{

            IncidentsModel::where('id', $id)->delete();

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);

        }
    }
}
