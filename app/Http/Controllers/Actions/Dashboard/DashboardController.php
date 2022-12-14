<?php

namespace App\Http\Controllers\Actions\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
// Custom
use App\Models\Users\User;
use App\Models\Profiles\Profile;
use App\Models\FlightPlans\FlightPlan;
use App\Models\ServiceOrders\ServiceOrder;
use App\Models\Reports\Report;
use App\Models\Accesses\AccessedDevice;
use App\Models\Accesses\AnnualTraffic;

class DashboardController extends Controller
{

    function __construct(User $userModel, Profile $profileModel, FlightPlan $flightPlanModel, ServiceOrder $serviceOrderModel, Report $reportModel, AccessedDevice $accessedDevicesModel, AnnualTraffic $annualTrafficModel)
    {
        $this->userModel = $userModel;
        $this->profileModel = $profileModel;
        $this->flightPlanModel = $flightPlanModel;
        $this->serviceOrderModel = $serviceOrderModel;
        $this->reportModel = $reportModel;
        $this->accessedDevicesModel = $accessedDevicesModel;
        $this->annualTrafficModel = $annualTrafficModel;
    }

    public function __invoke(): \Illuminate\Http\Response
    {

        //$accessed_devices_collection = $this->accessedDevicesModel->get();
        //$annual_traffic_collection = $this->annualTrafficModel->get();

        $collections = [
            "users" => $this->userModel->withTrashed()->get(),
            "profiles" => $this->profileModel->withTrashed()->get(),
            "flight_plans" => $this->flightPlanModel->withTrashed()->get(),
            "service_orders" => $this->serviceOrderModel->withTrashed()->get(),
            "reports" => $this->reportModel->withTrashed()->get()
        ];

        $data = [];

        foreach ($collections as $key => $collection) {

            $trashed_by_month = 0;
            $active_by_month = 0;

            $data[$key]["total"] = $collection->count();

            foreach ($collection as $index => $item) {

                if ($item->trashed()) {
                    $trashed_by_month++;
                } else {
                    $active_by_month++;
                }
            }

            $data[$key][$item->created_at->format('F')]["trashed"][$index] = $trashed_by_month;
            $data[$key][$item->created_at->format('F')]["active"][$index] = $active_by_month;

            $data[$key][$item->created_at->format('F')]["total"] = $trashed_by_month + $active_by_month;
        }

        return response($data, 200);
    }
}
