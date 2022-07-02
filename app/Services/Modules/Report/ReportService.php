<?php

namespace App\Services\Modules\Report;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// Custom
use App\Models\Reports\ReportModel;
use App\Services\FormatDataService;

class ReportService{
    
    private FormatDataService $format_data_service;
    private ReportModel $model;

    /**
     * Dependency injection.
     * 
     * @param App\Services\FormatDataService $service
     * @param App\Models\Incidents\ReportModel $incident
     */
    public function __construct(FormatDataService $service, ReportModel $model){
        $this->format_data_service = $service;
        $this->model = $model;
    }

    /**
    * Load all reports with pagination.
    *
    * @param int $limit
    * @param int $actual_page
    * @param int|string $where_value
    * @return \Illuminate\Http\Response
    */
    public function loadAReportsWithPagination(int $limit, int $current_page, int|string $where_value) {

        $data = DB::table('reports')
        ->where("reports.deleted_at", null)
        ->when($where_value, function ($query, $where_value) {

            $query->where('id', $where_value);

        })->orderBy('id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if($data->total() > 0){

            $data_formated = $this->format_data_service->genericDataFormatting($data);

            return response($data_formated, 200);

        }else{

            return response(["message" => "Nenhum relatório encontrado."], 404);

        }
    }

    /**
     * Create report.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function createReport(Request $request){

        $this->model->create($request->only(["start_date", "end_date", "flight_log", "observation"]));

        return response(["message" => "Relatório criado com sucesso!"], 200); 

    }

    /**
     * Update report.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $report_id
     * @return \Illuminate\Http\Response
     */
    public function updateReport(Request $request, int $report_id) {

        $this->model->where('id', $report_id)->update($request->only(["start_date", "end_date", "flight_log", "observation"]));

        return response(["message" => "Relatório atualizado com sucesso!"], 200);

    }

    /**
     * Soft delete report.
     *
     * @param int $report_id
     * @return \Illuminate\Http\Response
     */
    public function deleteReport(int $report_id) {

        $this->model->flight_plans->update("report_id", null);

        $this->model->where('id', $report_id)->delete();

        return response(["message" => "Relatório deletado com sucesso!"], 200);

    }

}