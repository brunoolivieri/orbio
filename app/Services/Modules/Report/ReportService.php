<?php

namespace App\Services\Modules\Report;

use Illuminate\Http\Request;
// Models
use App\Repositories\Modules\Reports\ReportRepository;
// Resources
use App\Http\Resources\Modules\Reports\ReportsPanelResource;

class ReportService
{

    public function __construct(ReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        $data = $this->repository->getPaginate($limit, $order_by, $page_number, $search, $filters);

        if ($data->total() > 0) {
            return response(new ReportsPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum relatório encontrado."], 404);
        }
    }

    public function createResource(array $data)
    {
        //
    }

    public function updateResource(Request $request, int $report_id)
    {
        //
    }

    public function deleteResource(int $report_id)
    {
        //
    }
}
