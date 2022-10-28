<?php

namespace App\Http\Controllers\Modules\Report;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Request;
// Custom
use App\Http\Requests\Modules\Reports\ReportStoreRequest;
use App\Http\Requests\Modules\Reports\ReportUpdateRequest;
use App\Services\Modules\Report\ReportService;

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

        return $this->service->loadResourceWithPagination(
            request()->limit,
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter === "0" ? [] : request()->filter
        );
    }

    public function downloadReport(string $filename): \Illuminate\Http\Response
    {
        Gate::authorize('reports_read');
        return $this->service->downloadResource($filename);
    }

    public function store(ReportStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');
        return $this->service->createResource($request->only(['name', 'file', 'blob', 'service_order_id']));
    }

    public function update(ReportUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        return $this->service->updateResource($request->validated(), $id);
    }

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        return $this->service->deleteResource($id);
    }
}
