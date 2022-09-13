<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FlightPlans\FlightPlan;

class LoadFlightPlansController extends Controller
{

    function __construct(FlightPlan $flightPlanModel)
    {
        $this->model = $flightPlanModel;
    }

    public function __invoke(): \Illuminate\Http\Response
    {

        if (isset(request()->where)) {
            $data = $this->model->find(request()->where);
        } else {
            $data = $this->model->all();
        }

        return response($data, 200);
    }
}
