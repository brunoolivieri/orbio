<?php

namespace App\Http\Controllers\Modules\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
// Custom
use App\Models\Reports\ReportModel;
use App\Http\Requests\Modules\Reports\ReportStoreRequest;
use App\Http\Requests\Modules\Reports\ReportUpdateRequest;
use App\Services\FormatDataTable;

class ReportModuleController extends Controller
{

    private FormatDataTable $format_data_service;
    private ReportModel $report_model;

    /**
     * Dependency injection.
     * 
     * @param App\Services\FormatDataTable $service
     * @param App\Models\Reports\ReportModel $report
     */
    public function __construct(FormatDataTable $service, ReportModel $report){
        $this->format_data_service = $service;
        $this->report_model = $report;
    }

    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {
        Gate::authorize('reports_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model_response = $this->report_model->loadAReportsWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            if($model_response["data"]->total() > 0){

                $data_formated = $this->format_data_service->genericDataFormatting($model_response["data"]);
                //$data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('reports_error')->info("[Método: Index][Controlador: ReportModuleController] - Nenhum registro de relatório encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('reports_error')->error("[Método: Store][Controlador: ReportModuleController] - Falha na criação do relatório - Erro: ".$model_response["error"]);

            return response(["error" => $model_response->content()], 500);

        }  

    }

     /**
     * Method for organize data for the frontend table.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array
     */
    private function formatDataForTable(LengthAwarePaginator $data) : array {

        $arr_with_formated_data = [];

        foreach($data->items() as $row => $record){

            // O tratamento do formato das datas é realizado no frontend, com a lib moment.js, para evitar erros 
            $created_at_formated = date( 'd-m-Y h:i', strtotime($record->created_at));
            $updated_at_formated = $record->updated_at === NULL ? "Sem dados" : date( 'd-m-Y h:i', strtotime($record->updated_at));
            $flight_start_date = $record->start_date === NULL ? "Sem dados" : $record->start_date;
            $flight_end_date = $record->end_date === NULL ? "Sem dados" : $record->end_date;
            
            $arr_with_formated_data["records"][$row] = array(
                "report_id" => $record->id,
                "flight_log" => $record->flight_log,
                "observation" => $record->observation,
                "created_at" => $created_at_formated,
                "updated_at" => $updated_at_formated,
                "start_date" => $flight_start_date,
                "end_date" => $flight_end_date
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
    public function store(ReportStoreRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');
        
        try{

            ReportModel::create($request->only(["start_date", "end_date", "flight_log", "observation"]));

            Log::channel('reports_action')->info("[Método: Store][Controlador: ReportModuleController] - Relatório criado com sucesso");

            return response("", 200);
            
        }catch(\Exception $e){

            Log::channel('reports_error')->error("[Método: Store][Controlador: ReportModuleController] - Falha na criação do relatório - Erro: ".$e->getMessage());

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
        Gate::authorize('reports_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model_response = $this->report_model->loadAReportsWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            if($model_response["data"]->total() > 0){

                $data_formated = $this->format_data_service->genericDataFormatting($model_response["data"]);
                //$data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('reports_error')->error("[Método: Show][Controlador: ReportModuleController] - Nenhum registro encontrado na pesquisa");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('reports_error')->error("[Método: Show][Controlador: ReportModuleController] - Erro: ".$model_response["error"]);

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
    public function update(ReportUpdateRequest $request, $id) : \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');
        
        try{

            ReportModel::where('id', $id)->update($request->only(["start_date", "end_date", "flight_log", "observation"]));

            Log::channel('reports_action')->info("[Método: Update][Controlador: ReportModuleController] - Relatório atualizado com sucesso - ID do relatório: ".$id);

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            Log::channel('reports_error')->error("[Método: Update][Controlador: ReportModuleController] - Falha na atualização do relatório - Erro: ".$e->getMessage());

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
        Gate::authorize('reports_write');
        
        try{

            ReportModel::where('id', $id)->delete();

            Log::channel('reports_action')->info("[Método: Destroy][Controlador: ReportModuleController] - Relatório removido com sucesso - ID do relatório: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('reports_error')->error("[Método: Destroy][Controlador: ReportModuleController] - Falha na remoção do relatório - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()]);

        }
 
    }
}
