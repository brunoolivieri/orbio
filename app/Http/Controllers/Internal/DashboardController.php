<?php

namespace App\Http\Controllers\Internal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Custom
use App\Models\User\UserModel;
use App\Models\FlightPlans\FlightPlanModel;
use App\Models\Orders\ServiceOrderModel;
use App\Models\Reports\ReportModel;

class DashboardController extends Controller
{

    function __construct(UserModel $user_model, FlightPlanModel $flight_plan_model, ServiceOrderModel $service_order_model, ReportModel $report_model){
        $this->user_model = $user_model;
        $this->flight_plan_model = $flight_plan_model;
        $this->service_order_model = $service_order_model;
        $this->report_model = $report_model;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {

        return response([
            "users" => [
                "total" => $this->user_model->all()->count(),
                "active" => $this->user_model->where("deleted_at", null)->count(),
                "inactive" => $this->user_model->where("deleted_at", "!=", null)->count()
            ],
            "flight_plans" => [
                "total" => $this->flight_plan_model->all()->count()
            ],
            "service_orders" => [
                "total" => $this->service_order_model->all()->count()
            ],
            "reports" => [
                "total" => $this->report_model->all()->count()
            ]
        ], 200);
    }
}
