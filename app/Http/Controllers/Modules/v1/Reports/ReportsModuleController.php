<?php

namespace App\Http\Controllers\Modules\v1\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Requests\Modules\Reports\ReportUpdateRequest;
use App\Services\Modules\Report\ReportService;
use App\Exports\GenericExport;
use App\Models\Reports\Report;
use App\Http\Resources\Modules\Reports\ReportsPanelResource;

class ReportsModuleController extends Controller
{

    private ReportService $service;

    public function __construct(ReportService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        Gate::authorize('reports_read');

        try {

            $result = $this->service->getPaginate(
                request()->limit,
                request()->page,
                is_null(request()->search) ? "0" : request()->search
            );

            if ($result->total() == 0) {
                throw new \Exception("Nenhum relatório encontrado", 404);
            }

            return response(new ReportsPanelResource($result), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Report(), $request->limit), 'reports.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        try {

            $data = [
                "name" => $request->name,
                "file" => $request->file("file"),
                "blob" => $request->blob,
                'service_order_id' => $request->service_order_id
            ];

            $this->service->createOne($data);
            return response(["message" => "Relatório criado com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function update(ReportUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        try {
            $this->service->updateOne($request->validated(), $id);
            return response(["message" => "Relatório atualizado com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        try {
            $this->service->delete($request->ids);
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
