<?php

namespace App\Http\Controllers\Modules\Report;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Request;
use Maatwebsite\Excel\Facades\Excel;
// Custom
use App\Http\Requests\Modules\Reports\ReportStoreRequest;
use App\Http\Requests\Modules\Reports\ReportUpdateRequest;
use App\Services\Modules\Report\ReportService;
use App\Exports\GenericExport;
use App\Models\Reports\Report;

class ReportModuleController extends Controller
{

    private ReportService $service;

    public function __construct(ReportService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        Gate::authorize('reports_read');

        return $this->service->getPaginate(
            request()->limit,
            request()->page,
            is_null(request()->search) ? "0" : request()->search
        );
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Report(), $request->limit), 'reports.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function downloadReport(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('reports_read');

        return $this->service->download(request()->filename, request()->report_id);
    }

    public function store(ReportStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');
        return $this->service->createOne($request->only(['name', 'file', 'blob', 'service_order_id']));
    }

    public function update(ReportUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        return $this->service->updateOne($request->validated(), $id);
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        return $this->service->delete($request->ids);
    }
}
