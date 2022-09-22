<?php

namespace App\Services\Modules\Report;

use Illuminate\Http\Request;
// Models
use App\Models\Reports\Report;
// Resources
use App\Http\Resources\Modules\Reports\ReportsPanelResource;

class ReportService
{

    private Report $model;

    /**
     * Dependency injection.
     * 
     * @param App\Models\Incidents\Report $incident
     */
    public function __construct(Report $model)
    {
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
    public function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {

        $data = Report::with('log')
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);

        if ($data->total() > 0) {
            return response(new ReportsPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum relatório encontrado."], 404);
        }
    }

    /**
     * Create report.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request)
    {
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
    public function updateResource(Request $request, int $report_id)
    {
        $report = $this->model->findOrFail($report_id);

        $report->update($request->only(["observation"]));

        return response(["message" => "Relatório atualizado com sucesso!"], 200);
    }

    /**
     * Soft delete report.
     *
     * @param int $report_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $report_id)
    {
        $report = $this->model->findOrFail($report_id);

        $report->delete();

        return response(["message" => "Relatório deletado com sucesso!"], 200);
    }
}
