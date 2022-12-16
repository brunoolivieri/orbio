<?php

namespace App\Http\Controllers\Modules\FlightPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
// Custom
use App\Http\Requests\Modules\FlightPlans\FlightPlanUpdateRequest;
use App\Services\Modules\FlightPlan\FlightPlanService;
use App\Exports\GenericExport;
use App\Models\FlightPlans\FlightPlan;

class FlightPlanModuleController extends Controller
{

    private FlightPlanService $service;

    public function __construct(FlightPlanService $service)
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

    public function exportAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new FlightPlan(), $request->limit), 'planos_de_voo.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function downloadFlightPlan(string $filename): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_read');

        return $this->service->download($filename);
    }

    public function store(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');
       
        return $this->service->createOne($request->only(["name", "routes_file", "image_file", "image_filename", "description", "coordinates"]));
    }

    public function update(FlightPlanUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->updateOne($request->validated(), $id);
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');
        
        return $this->service->delete($request->ids);;
    }
}
