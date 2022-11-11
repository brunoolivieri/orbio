<?php

namespace App\Http\Controllers\Modules\FlightPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Services
use App\Services\Modules\FlightPlan\FlightPlanLogService;
// Request
use App\Http\Requests\Modules\FlightPlans\Logs\UpdateLogRequest;

class FlightPlanModuleLogController extends Controller
{

    private FlightPlanLogService $service;

    public function __construct(FlightPlanLogService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_read');

        return $this->service->getPaginate(
            request()->limit,
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter === "0" ? [] : request()->filter
        );
    }

    public function exportAsCsv()
    {
        dd(request()->limit);
    }

    public function store(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->createOne($request->only(["ip", "http_port", "logs"]));
    }

    public function update(UpdateLogRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->updateOne($request->only(["name", "flight_plan_id", "service_order_id"]), $id);
    }

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->deleteOne($id);
    }
}
