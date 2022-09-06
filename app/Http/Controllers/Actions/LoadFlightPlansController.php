<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Custom
use App\Models\FlightPlans\FlightPlan;

class LoadFlightPlansController extends Controller
{
    /****
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {

        if (isset(request()->where)) {
            $data = FlightPlan::find(request()->where);
        } else {
            $data = FlightPlan::all();
        }

        return $data;
    }
}
