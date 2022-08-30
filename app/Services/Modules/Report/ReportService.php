<?php

namespace App\Services\Modules\Report;

use Illuminate\Http\Request;
// Custom
use App\Models\Reports\ReportModel;
use App\Http\Resources\Modules\Reports\ReportsPanelResource;

class ReportService{

    private ReportModel $model;

    /**
     * Dependency injection.
     * 
     * @param App\Models\Incidents\ReportModel $incident
     */
    public function __construct(ReportModel $model){
        $this->model = $model;
    }

    /**
    * Load all reports with pagination.
    *
    * @param int $limit
    * @param int $actual_page
    * @param int|string $typed_search
    * @return \Illuminate\Http\Response
    */
    public function loadResourceWithPagination(int $limit, int $current_page, int|string $typed_search) {

        $data = ReportModel::when($typed_search, function ($query, $typed_search) {
            $query->where('id', $typed_search);
        })
        ->orderBy('id')
        ->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if($data->total() > 0){
            return response(new ReportsPanelResource($data), 200);
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
    public function createResource(Request $request){

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
    public function updateResource(Request $request, int $report_id) {

        $this->model->where('id', $report_id)->update($request->only(["start_date", "end_date", "flight_log", "observation"]));

        return response(["message" => "Relatório atualizado com sucesso!"], 200);

    }

    /**
     * Soft delete report.
     *
     * @param int $report_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $report_id) {

        $this->model->flight_plans->update("report_id", null);

        $this->model->where('id', $report_id)->delete();

        return response(["message" => "Relatório deletado com sucesso!"], 200);

    }

}