<?php

namespace App\Http\Controllers\Modules\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;
use App\Models\Users\User;
use App\Models\Profiles\Profile;
use App\Models\FlightPlans\FlightPlan;
use App\Models\ServiceOrders\ServiceOrder;
use App\Models\Reports\Report;

class DashboardController extends Controller
{

    private array $data = [];

    function __construct(User $userModel, Profile $profileModel, FlightPlan $flightPlanModel, ServiceOrder $serviceOrderModel, Report $reportModel)
    {
        $this->data = [];
        $this->userModel = $userModel;
        $this->profileModel = $profileModel;
        $this->flightPlanModel = $flightPlanModel;
        $this->serviceOrderModel = $serviceOrderModel;
        $this->reportModel = $reportModel;
    }

    public function __invoke(): \Illuminate\Http\Response
    {

        try {

            $collections = [
                "users" => $this->userModel->withTrashed()->get(),
                "profiles" => $this->profileModel->withTrashed()->get(),
                "flight_plans" => $this->flightPlanModel->withTrashed()->get(),
                "service_orders" => $this->serviceOrderModel->withTrashed()->get(),
                "reports" => $this->reportModel->withTrashed()->get()
            ];

            foreach ($collections as $key => $collection) {

                $this->data[$key]["total"] = $collection->count();
                $this->data[$key]["active"] = 0;
                if ($key === "users") {
                    $this->data[$key]["inative"] = 0;
                }
                $this->data[$key]["deleted"] = 0;

                foreach ($collection as $item) {
                    if ($item->trashed()) {
                        $this->data[$key]["deleted"]++;
                    } else {
                        if ($key === "users" && is_null($item->last_access)) {
                            $this->data[$key]["inative"]++;
                        } else {
                            $this->data[$key]["active"]++;
                        }
                    }
                }
            }

            return response($this->data, 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
