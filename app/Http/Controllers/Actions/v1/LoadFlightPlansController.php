<?php

namespace App\Http\Controllers\Actions\v1;

use App\Http\Controllers\Controller;
use App\Models\FlightPlans\FlightPlan;

class LoadFlightPlansController extends Controller
{

    function __construct(FlightPlan $flightPlanModel)
    {
        $this->model = $flightPlanModel;
    }

    public function __invoke()
    {
        try {

            if (isset(request()->where)) {
                $data = $this->model->find(request()->where);
            } else {
                $data = $this->model->all();
            }

            return response()->json($data)->setStatusCode(200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()])->setStatusCode($e->getCode());
        }
    }
}
