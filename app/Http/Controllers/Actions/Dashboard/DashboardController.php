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

        // ==== PIZZA CHARTS DATA ==== //

        $users_data = [
            "total" => $users_collection->count(),
            "active" => $users_collection->where("deleted_at", "=", null)->where("status", 1)->count(),
            "inative" => $users_collection->where("deleted_at", "=", null)->where("status", 0)->count(),
            "deleted" => $users_collection->where("deleted_at", "!=", null)->count()
        ];

        $profiles_data = [
            "total" => $profiles_collection->count(),
            "active" => $profiles_collection->where("deleted_at", "=", null)->count(),
            "deleted" => $profiles_collection->where("deleted_at", "!=", null)->count()
        ];

        $flight_plans_data = [
            "total" => $flight_plans_collection->count(),
            "active" => $flight_plans_collection->where("deleted_at", "=", null)->count(),
            "deleted" => $flight_plans_collection->where("deleted_at", "!=", null)->count()
        ];

        $service_orders_data = [
            "total" => $service_order_collection->count(),
            "finished" => $service_order_collection->where("deleted_at", "=", null)->where("start_date", ">=", "end_date")->count(),
            "to_finish" => $service_order_collection->where("deleted_at", "=", null)->where("start_date", "<", "end_date")->count(),
            "deleted" => $service_order_collection->where("deleted_at", "!=", null)->count()
        ];

        $reports_data = [
            "total" => $reports_collection->count(),
            "active" => $reports_collection->where("deleted_at", "=", null)->count(),
            "deleted" => $reports_collection->where("deleted_at", "!=", null)->count()
        ];

        $desktop = $accessed_devices_collection->sum("personal_computer");
        $smartphone = $accessed_devices_collection->sum("smartphone");
        $tablet = $accessed_devices_collection->sum("tablet");
        $other = $accessed_devices_collection->sum("other");
        $total = $desktop + $smartphone + $tablet + $other;

        $devices = [
            "total" => $total,
            "desktop" => intval($desktop),
            "smartphone" => intval($smartphone),
            "tablet" => intval($tablet),
            "other" => intval($other)
        ];

        // ==== LINE CHART DATA ==== //

        $traffic = [
            [
                "x" => "Janeiro",
                "y" => $annual_traffic_collection->sum("january")
            ],
            [
                "x" => "Fevereiro",
                "y" => $annual_traffic_collection->sum("february")
            ],
            [
                "x" => "Março",
                "y" => $annual_traffic_collection->sum("march")
            ],
            [
                "x" => "Abril",
                "y" => $annual_traffic_collection->sum("april")
            ],
            [
                "x" => "Maio",
                "y" => $annual_traffic_collection->sum("may")
            ],
            [
                "x" => "Junho",
                "y" => $annual_traffic_collection->sum("june")
            ],
            [
                "x" => "Julho",
                "y" => $annual_traffic_collection->sum("july")
            ],
            [
                "x" => "Agosto",
                "y" => $annual_traffic_collection->sum("august")
            ],
            [
                "x" => "Setembro",
                "y" => $annual_traffic_collection->sum("september")
            ],
            [
                "x" => "Outubro",
                "y" => $annual_traffic_collection->sum("october")
            ],
            [
                "x" => "Novembro",
                "y" => $annual_traffic_collection->sum("november")
            ],
            [
                "x" => "Dezembro",
                "y" => $annual_traffic_collection->sum("december")
            ]
        ];

        $registrations = [
            [
                "x" => "Janeiro",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 1)->withTrashed()->count()
            ],
            [
                "x" => "Fevereiro",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 2)->withTrashed()->count()
            ],
            [
                "x" => "Março",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 3)->withTrashed()->count()
            ],
            [
                "x" => "Abril",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 4)->withTrashed()->count()
            ],
            [
                "x" => "Maio",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 5)->withTrashed()->count()
            ],
            [
                "x" => "Junho",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 6)->withTrashed()->count()
            ],
            [
                "x" => "Julho",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 7)->withTrashed()->count()
            ],
            [
                "x" => "Agosto",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 8)->withTrashed()->count()
            ],
            [
                "x" => "Setembro",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 9)->withTrashed()->count()
            ],
            [
                "x" => "Outubro",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 10)->withTrashed()->count()
            ],
            [
                "x" => "Novembro",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 11)->withTrashed()->count()
            ],
            [
                "x" => "Dezembro",
                "y" => $this->userModel->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 12)->withTrashed()->count()
            ]
        ];

        // ==== RESPONSE DATA STRUCTURE ==== //

        // The response structure follows the data organization rules of the charts
        // For pie chart: https://nivo.rocks/pie/
        // For line chart: https://nivo.rocks/line/

        return response([
            "users" => [
                "total" => $users_data["total"],
                "chart" => [
                    [
                        "id" => "Ativos",
                        "label" => "Ativos",
                        "value" => $users_data["active"] > 0 ? $users_data["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Inativos",
                        "label" => "Inativos",
                        "value" => $users_data["inative"] > 0 ? $users_data["inative"] : "",
                        "color" => "#FDAE61"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados",
                        "value" => $users_data["deleted"] > 0 ? $users_data["deleted"] : "",
                        "color" => "#F47560"
                    ]
                ]
            ],
            "profiles" => [
                "total" => $profiles_data["total"],
                "chart" => [
                    [
                        "id" => "Ativos",
                        "label" => "Ativos",
                        "value" => $profiles_data["active"] > 0 ? $profiles_data["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados",
                        "value" => $profiles_data["deleted"] > 0 ? $profiles_data["deleted"] : "",
                        "color" => "#F47560"
                    ]
                ]
            ],
            "flight_plans" => [
                "total" => $flight_plans_data["total"],
                "chart" => [
                    [
                        "id" => "Ativos",
                        "label" => "Ativos",
                        "value" => $flight_plans_data["active"] > 0 ? $flight_plans_data["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados",
                        "value" => $flight_plans_data["deleted"] > 0 ? $flight_plans_data["deleted"] : "",
                        "color" => "#F47560"
                    ]
                ]
            ],
            "service_orders" => [
                "total" => $service_orders_data["total"],
                "chart" => [
                    [
                        "id" => "Finalizadas",
                        "label" => "Finalizadas",
                        "value" => $service_orders_data["finished"] > 0 ? $service_orders_data["finished"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Deletadas",
                        "label" => "Deletadas",
                        "value" => $service_orders_data["deleted"] > 0 ? $service_orders_data["deleted"] : "",
                        "color" => "#F47560"
                    ],
                    [
                        "id" => "Em progresso",
                        "label" => "Em progresso",
                        "value" => $service_orders_data["to_finish"] > 0 ? $service_orders_data["to_finish"] : "",
                        "color" => "#F1E15B"
                    ]
                ]
            ],
            "reports" => [
                "total" => $reports_data["total"],
                "chart" => [
                    [
                        "id" => "Acessíveis",
                        "label" => "Acessíveis",
                        "value" => $reports_data["active"] > 0 ? $reports_data["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados",
                        "value" => $reports_data["deleted"] > 0 ? $reports_data["deleted"] : "",
                        "color" => "#F47560"
                    ]
                ]
            ],
            "devices" => [
                "total" => $devices["total"],
                "chart" => [
                    [
                        "id" => "Desktop",
                        "label" => "Desktop",
                        "value" => $devices["desktop"] > 0 ? $devices["desktop"] : "",
                        "color" => "#F1E15B"
                    ],
                    [
                        "id" => "Smartphone",
                        "label" => "Smartphone",
                        "value" => $devices["smartphone"] > 0 ? $devices["smartphone"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Tablet",
                        "label" => "Tablet",
                        "value" => $devices["tablet"] > 0 ? $devices["tablet"] : "",
                        "color" => "#F47560"
                    ],
                    [
                        "id" => "Other",
                        "label" => "Other",
                        "value" => $devices["other"] > 0 ? $devices["other"] : "",
                        "color" => "#E8C1A0"
                    ]
                ]
            ],
            "registrations" => [
                [
                    "id" => "Registros",
                    "data" => $registrations
                ]
            ],
            "traffic" => [
                [
                    "id" => "Tráfego",
                    "data" => $traffic
                ]
            ]
        ], 200);
    }
}
