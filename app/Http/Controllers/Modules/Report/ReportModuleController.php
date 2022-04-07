<?php

namespace App\Http\Controllers\Modules\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reports\ReportsModel;
use Illuminate\Pagination\LengthAwarePaginator;

class ReportModuleController extends Controller
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

        $model = new ReportsModel();

        $model_response = $model->loadAReportsWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            $data_formated = $this->formatDataForTable($model_response["data"]);

            return response($data_formated, 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response->content()], 500);

        }  

    }

    /**
     * Data is formated for the frontend reports table
     *
     * @param object $data
     * @return array
     */
    private function formatDataForTable(LengthAwarePaginator $data) : array {

        $arr_with_formated_data = [];

        foreach($data->items() as $row => $record){

            // O tratamento do formato das datas é realizado no frontend, com a lib moment.js, para evitar erros 
            $created_at_formated = date( 'd-m-Y h:i', strtotime($record->dh_criacao));
            $updated_at_formated = $record->dh_atualizacao === NULL ? "Sem dados" : date( 'd-m-Y h:i', strtotime($record->dh_atualizacao));
            $flight_start_date = $record->dh_inicio_voo === NULL ? "Sem dados" : $record->dh_inicio_voo;
            $flight_end_date = $record->dh_fim_voo === NULL ? "Sem dados" : $record->dh_fim_voo;
            
            $arr_with_formated_data["records"][$row] = array(
                "report_id" => $record->id,
                "flight_log" => $record->log_voo,
                "report_note" => $record->observacao,
                "created_at" => $created_at_formated,
                "updated_at" => $updated_at_formated,
                "flight_start_date" => $flight_start_date,
                "flight_end_date" => $flight_end_date
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

        // "log_voo" => 'required|file'
        $request->validate([
            "dh_inicio_voo" => 'required|date',
            "dh_fim_voo" => 'required|date',
            "observacao" => 'required|string'
        ]);
        
        try{

            ReportsModel::insert($request->except("auth"));

            return response("", 200);
            
        }catch(\Exception $e){

            return response(["error" => $e->getMessage()]);

        }

    }

     /**
     * Display the specified resource.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function show($request) : \Illuminate\Http\Response
    {

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new ReportsModel();

        $model_response = $model->loadAReportsWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            $data_formated = $this->formatDataForTable($model_response["data"]);

            return response($data_formated, 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response->content()], 500);

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

        // "log_voo" => 'required|file'
        $request->validate([
            "dh_inicio_voo" => 'required|date',
            "dh_fim_voo" => 'required|date',
            "observacao" => 'required|string'
        ]);
        
        try{

            ReportsModel::where('id', $id)->update($request->except("auth"));

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

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

            ReportsModel::where('id', $id)->delete();

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()]);

        }
 
    }
}
