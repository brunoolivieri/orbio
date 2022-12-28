<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FlightPlans\FlightPlan;
use App\Models\Logs\Log;

class LoadServiceOrderByFlightPlan extends Controller
{

    function __construct(FlightPlan $flightPlanModel, Log $logModel)
    {
        $this->flightPlanModel = $flightPlanModel;
        $this->logModel = $logModel;
    }
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $flight_plan = $this->flightPlanModel->findOrFail(request()->flight_plan_id);

        //$valid_service_orders = [];

        return response($flight_plan->service_orders, 200);
    }
}
