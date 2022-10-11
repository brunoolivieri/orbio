<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FlightPlans\FlightPlan;

class LoadServiceOrderByFlightPlan extends Controller
{

    function __construct(FlightPlan $flightPlanModel)
    {
        $this->model = $flightPlanModel;
    }
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $flight_plan = $this->model->findOrFail(request()->flight_plan_id);

        $service_orders = $flight_plan->service_orders;

        return response($service_orders, 200);
    }
}
