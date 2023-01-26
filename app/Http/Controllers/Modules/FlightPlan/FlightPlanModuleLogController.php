<?php

namespace App\Http\Controllers\Modules\FlightPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
// Custom
use App\Services\Modules\FlightPlan\FlightPlanLogService;
use App\Http\Requests\Modules\FlightPlans\Logs\UpdateLogRequest;
use App\Exports\GenericExport;
use App\Models\Logs\Log;

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
            request()->page,
            is_null(request()->search) ? "0" : request()->search
        );
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Log(), $request->limit), 'logs.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function downloadLog(string $filename): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_read');

        return $this->service->download($filename);
    }

    public function processSelectedLogs(Request $request)
    {
        Gate::authorize('flight_plans_write');

        return $this->service->processSelectedLogs((array) $request->file('files'));
    }

    public function store(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->createOne([
            "logs" => $request->file('files'),
            "images" => $request->images
        ]);
    }

    public function update(UpdateLogRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->updateOne($request->only(["name", "flight_plan_id", "service_order_id"]), $id);
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->delete($request->ids);
    }
}
