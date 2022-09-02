<?php

namespace App\Http\Controllers\Internal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// Custom
use App\Models\User\UserModel;
use App\Models\Profiles\ProfileModel;
use App\Models\FlightPlans\FlightPlanModel;
use App\Models\Orders\ServiceOrderModel;
use App\Models\Reports\ReportModel;
use App\Models\Accesses\AccessedDevicesModel;
use App\Models\Accesses\AnnualAccessesModel;

class DashboardController extends Controller
{

    function __construct(UserModel $userModel, ProfileModel $profileModel, FlightPlanModel $flightPlanModel, ServiceOrderModel $serviceOrderModel, ReportModel $reportModel, AccessedDevicesModel $accessedDevicesModel, AnnualAccessesModel $annualAccessesModel)
    {
        $this->userModel = $userModel;
        $this->profileModel = $profileModel;
        $this->flightPlanModel = $flightPlanModel;
        $this->serviceOrderModel = $serviceOrderModel;
        $this->reportModel = $reportModel;
        $this->accessedDevicesModel = $accessedDevicesModel;
        $this->annualAccessesModel = $annualAccessesModel;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {

        // ==== PIZZA CHARTS DATA ==== //

        $users = [
            "total" => $this->userModel->withTrashed()->count(),
            "active" => $this->userModel->where("status", 1)->count(),
            "inative" => $this->userModel->where("status", 0)->count(),
            "deleted" => $this->userModel->onlyTrashed()->count()
        ];

        $profiles = [
            "total" => $this->profileModel->withTrashed()->count(),
            "active" => $this->profileModel->count(),
            "deleted" => $this->profileModel->onlyTrashed()->count()
        ];

        $flight_plans = [
            "total" => $this->flightPlanModel->withTrashed()->count(),
            "active" => $this->flightPlanModel->where("status", 1)->count(),
            "inative" => $this->flightPlanModel->where("status", 0)->count(),
            "deleted" => $this->flightPlanModel->onlyTrashed()->count()
        ];

        $service_orders = [
            "total" => $this->serviceOrderModel->withTrashed()->count(),
            "finished" => $this->serviceOrderModel->whereRaw("service_orders.start_date >= service_orders.end_date")->count(),
            "to_finish" => $this->serviceOrderModel->whereRaw("service_orders.start_date < service_orders.end_date")->count(),
            "deleted" => $this->serviceOrderModel->onlyTrashed()->count()
        ];

        $reports = [
            "total" => $this->reportModel->withTrashed()->count(),
            "active" => $this->reportModel->count(),
            "deleted" => $this->reportModel->onlyTrashed()->count()
        ];

        $desktop = $this->accessedDevicesModel->sum("personal_computer");
        $smartphone = $this->accessedDevicesModel->sum("smartphone");
        $tablet = $this->accessedDevicesModel->sum("tablet");
        $other = $this->accessedDevicesModel->sum("other");
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
                "y" => $this->annualAccessesModel->sum("january")
            ],
            [
                "x" => "Fevereiro",
                "y" => $this->annualAccessesModel->sum("february")
            ],
            [
                "x" => "Março",
                "y" => $this->annualAccessesModel->sum("march")
            ],
            [
                "x" => "Abril",
                "y" => $this->annualAccessesModel->sum("april")
            ],
            [
                "x" => "Maio",
                "y" => $this->annualAccessesModel->sum("may")
            ],
            [
                "x" => "Junho",
                "y" => $this->annualAccessesModel->sum("june")
            ],
            [
                "x" => "Julho",
                "y" => $this->annualAccessesModel->sum("july")
            ],
            [
                "x" => "Agosto",
                "y" => $this->annualAccessesModel->sum("august")
            ],
            [
                "x" => "Setembro",
                "y" => $this->annualAccessesModel->sum("september")
            ],
            [
                "x" => "Outubro",
                "y" => $this->annualAccessesModel->sum("october")
            ],
            [
                "x" => "Novembro",
                "y" => $this->annualAccessesModel->sum("november")
            ],
            [
                "x" => "Dezembro",
                "y" => $this->annualAccessesModel->sum("december")
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
                "total" => $users["total"],
                "chart" => [
                    [
                        "id" => "Ativos",
                        "label" => "Ativos",
                        "value" => $users["active"] > 0 ? $users["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Inativos",
                        "label" => "Inativos",
                        "value" => $users["inative"] > 0 ? $users["inative"] : "",
                        "color" => "#FDAE61"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados",
                        "value" => $users["deleted"] > 0 ? $users["deleted"] : "",
                        "color" => "#F47560"
                    ]
                ]
            ],
            "profiles" => [
                "total" => $profiles["total"],
                "chart" => [
                    [
                        "id" => "Ativos",
                        "label" => "Ativos",
                        "value" => $profiles["active"] > 0 ? $profiles["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados",
                        "value" => $profiles["deleted"] > 0 ? $profiles["deleted"] : "",
                        "color" => "#F47560"
                    ]
                ]
            ],
            "flight_plans" => [
                "total" => $flight_plans["total"],
                "chart" => [
                    [
                        "id" => "Ativos",
                        "label" => "Ativos",
                        "value" => $flight_plans["active"] > 0 ? $flight_plans["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Inativos",
                        "label" => "Inativos",
                        "value" => $flight_plans["inative"] > 0 ? $flight_plans["inative"] : "",
                        "color" => "#F47560"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados",
                        "value" => $flight_plans["deleted"] > 0 ? $flight_plans["deleted"] : "",
                        "color" => "#F47560"
                    ]
                ]
            ],
            "service_orders" => [
                "total" => $service_orders["total"],
                "chart" => [
                    [
                        "id" => "Finalizadas",
                        "label" => "Finalizadas",
                        "value" => $service_orders["finished"] > 0 ? $service_orders["finished"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Deletadas",
                        "label" => "Deletadas",
                        "value" => $service_orders["deleted"] > 0 ? $service_orders["deleted"] : "",
                        "color" => "#F47560"
                    ],
                    [
                        "id" => "Em progresso",
                        "label" => "Em progresso",
                        "value" => $service_orders["to_finish"] > 0 ? $service_orders["to_finish"] : "",
                        "color" => "#7FC97F"
                    ]
                ]
            ],
            "reports" => [
                "total" => $reports["total"],
                "chart" => [
                    [
                        "id" => "Acessíveis",
                        "label" => "Acessíveis",
                        "value" => $reports["active"] > 0 ? $service_orders["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados",
                        "value" => $reports["deleted"] > 0 ? $service_orders["deleted"] : "",
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
