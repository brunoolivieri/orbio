<?php

namespace App\Http\Controllers\Modules\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
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

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        return $this->service->loadResourceWithPagination($limit, $actual_page, $where_value);
    }

    public function store(ReportStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        return $this->service->createResource($request);
    }

    public function show($request): \Illuminate\Http\Response
    {
        Gate::authorize('reports_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        return $this->service->loadResourceWithPagination($limit, $actual_page, $where_value);
    }

    public function update(ReportUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        return $this->service->updateResource($request, $id);
    }

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        return $this->service->deleteResource($id);
    }
}
