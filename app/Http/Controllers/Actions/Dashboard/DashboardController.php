<?php

namespace App\Http\Controllers\Actions\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function __invoke() : \Illuminate\Http\Response
    {

        // ==== COLLECTIONS ===== //

        $users_collection = $this->userModel->withTrashed()->get();
        $profiles_collection = $this->profileModel->withTrashed()->get();
        $flight_plans_collection = $this->flightPlanModel->withTrashed()->get();
        $service_order_collection = $this->serviceOrderModel->withTrashed()->get();
        $reports_collection = $this->reportModel->withTrashed()->get();
        $accessed_devices_collection = $this->accessedDevicesModel->get();
        $annual_traffic_collection = $this->annualTrafficModel->get();

        return response([''], 200);
    }
}
