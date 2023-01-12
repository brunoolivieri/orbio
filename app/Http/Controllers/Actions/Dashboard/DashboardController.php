<?php

namespace App\Http\Controllers\Actions\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;
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

        $collections = [
            "users" => $this->userModel->withTrashed()->get(),
            "profiles" => $this->profileModel->withTrashed()->get(),
            "flight_plans" => $this->flightPlanModel->withTrashed()->get(),
            "service_orders" => $this->serviceOrderModel->withTrashed()->get(),
            "reports" => $this->reportModel->withTrashed()->get()
        ];

        $counter = [
            "trashed" => 0,
            "active" => 0
        ];

        $initial_months_data = [
            'january' => $counter,
            'february' => $counter,
            'march' => $counter,
            'april' => $counter,
            'may' => $counter,
            'june' => $counter,
            'july' => $counter,
            'august' => $counter,
            'september' => $counter,
            'october' => $counter,
            'november' => $counter,
            'december' => $counter,
        ];

        $data = [];

        foreach ($collections as $key => $collection) {

            // Initial values for actual collection
            $data[$key]["total"] = $collection->count();
            $data[$key]["months"] = $initial_months_data;

            // Loop each item of actual collection
            foreach ($collection as $item) {

                $month = strtolower(Carbon::parse($item->created_at)->format('F'));
                $year = Carbon::parse($item->created_at)->format('y');
                $actual_year = Carbon::now()->format('y');

                if ($actual_year === $year) {

                    // Actual item was created in $month of actual year
                    // Add 1 to $month in "trashed" or "active" based in "deleted_at" column

                    if ($item->trashed()) {
                        $data[$key]["months"][$month]["trashed"]++;
                    } else {
                        $data[$key]["months"][$month]["active"]++;
                    }
                }
            }
        }

        return response($data, 200);
    }
}
