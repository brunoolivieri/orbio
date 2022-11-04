<?php

namespace App\Http\Controllers\Modules\Incident;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Models\Incidents\Incident;
use App\Http\Requests\Modules\Incidents\IncidentStoreRequest;
use App\Http\Requests\Modules\Incidents\IncidentUpdateRequest;
use App\Services\Modules\Incident\IncidentService;

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
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter === "0" ? [] : request()->filter
        );
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

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('incidents_write');

        return $this->service->deleteOne($id);
    }
}
