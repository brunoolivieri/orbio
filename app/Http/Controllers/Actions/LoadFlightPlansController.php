<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Custom
use App\Models\FlightPlans\FlightPlanModel;

class LoadFlightPlansController extends Controller
{
    /***
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {

        if(isset(request()->where)){
            $data = FlightPlanModel::find(request()->where);
        }else{
            $data = FlightPlanModel::all();
        }

        return $data;

    }
}
