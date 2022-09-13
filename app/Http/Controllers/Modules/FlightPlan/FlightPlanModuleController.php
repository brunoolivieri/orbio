<?php

namespace App\Http\Controllers\Modules\FlightPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Models
use App\Models\FlightPlans\FlightPlanModel;
// Form Request
use App\Http\Requests\Modules\FlightPlans\FlightPlanStoreRequest;
use App\Http\Requests\Modules\FlightPlans\FlightPlanUpdateRequest;
// Services
use App\Services\Modules\FlightPlan\FlightPlanService;

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

        return $this->service->loadResourceWithPagination(
            request()->limit,
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter
        );
    }

    public function downloadFlightPlan(string $filename): \Illuminate\Http\Response
    {

        Gate::authorize('flight_plans_read');

        return $this->service->downloadResource($filename);
    }

    public function store(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->createResource($request);
    }

    public function show($id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_read');

        //
    }

    public function update(FlightPlanUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->updateResource($request->validated(), $id);
    }

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->deleteResource($id);
    }
}
