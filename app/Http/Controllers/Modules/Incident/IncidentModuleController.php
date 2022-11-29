<?php

namespace App\Http\Controllers\Modules\Incident;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
// Custom
use App\Http\Requests\Modules\Incidents\IncidentStoreRequest;
use App\Http\Requests\Modules\Incidents\IncidentUpdateRequest;
use App\Services\Modules\Incident\IncidentService;
use App\Models\Incidents\Incident;
use App\Exports\GenericExport;

class IncidentModuleController extends Controller
{
    private IncidentService $service;

    public function __construct(IncidentService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        Gate::authorize('incidents_read');

        return $this->service->getPaginate(
            request()->limit,
            request()->page,
            is_null(request()->search) ? "0" : request()->search
        );
    }

    public function exportAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Incident(), $request->limit), 'incidentes.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(IncidentStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('incidents_write');

        return $this->service->createOne($request->only("date", "type", "description", "flight_plan_id", "service_order_id"));
    }

    public function update(IncidentUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('incidents_write');

        return $this->service->updateOne($request->only(["type", "description", "date", "flight_plan_id", "service_order_id"]), $id);
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('incidents_write');

        return $this->service->delete($request->ids);
    }
}
