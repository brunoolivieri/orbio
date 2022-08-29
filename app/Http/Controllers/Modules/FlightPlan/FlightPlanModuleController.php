<?php

namespace App\Http\Controllers\Modules\FlightPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Models\FlightPlans\FlightPlanModel;
use App\Http\Requests\Modules\FlightPlans\FlightPlanStoreRequest;
use App\Http\Requests\Modules\FlightPlans\FlightPlanUpdateRequest;
use App\Services\Modules\FlightPlan\FlightPlanService;

class FlightPlanModuleController extends Controller
{

    private FlightPlanService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\Modules\FlightPlan\FlightPlanService $service
     */
    public function __construct(FlightPlanService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Download the flight plan file
     * @param string $filename
     * @return \Illuminate\Http\Response
     */
    public function downloadFlightPlan(string $filename): \Illuminate\Http\Response
    {

        Gate::authorize('flight_plans_read');

        return $this->service->downloadResource($filename);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->createResource($request);
    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_read');

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\FlightPlans\FlightPlanUpdateRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(FlightPlanUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->updateResource($request->validated(), $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        return $this->service->deleteResource($id);
    }
}
