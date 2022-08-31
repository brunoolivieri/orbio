<?php

namespace App\Http\Controllers\Internal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Custom
use App\Models\User\UserModel;
use App\Models\Profiles\ProfileModel;
use App\Models\FlightPlans\FlightPlanModel;
use App\Models\Orders\ServiceOrderModel;
use App\Models\Reports\ReportModel;

class DashboardController extends Controller
{

    function __construct(UserModel $userModel, ProfileModel $profileModel, FlightPlanModel $flightPlanModel, ServiceOrderModel $serviceOrderModel, ReportModel $reportModel)
    {
        $this->userModel = $userModel;
        $this->profileModel = $profileModel;
        $this->flightPlanModel = $flightPlanModel;
        $this->serviceOrderModel = $serviceOrderModel;
        $this->reportModel = $reportModel;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
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

        // The response structure follows the data organization rules of the charts
        // For pie chart: https://nivo.rocks/pie/
        // For line chart: https://nivo.rocks/line/

        return response([
            "users" => [
                "total" => $users["total"],
                "chart" => [
                    [
                        "id" => "Ativos",
                        "label" => "Ativos (" . $users["active"] . ")",
                        "value" => $users["active"] > 0 ? $users["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Inativos",
                        "label" => "Inativos (" . $users["inative"] . ")",
                        "value" => $users["inative"] > 0 ? $users["inative"] : "",
                        "color" => "#F47560"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados (" . $users["deleted"] . ")",
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
                        "label" => "Ativos (" . $profiles["active"] . ")",
                        "value" => $profiles["active"] > 0 ? $profiles["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados (" . $profiles["deleted"] . ")",
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
                        "label" => "Ativos (" . $flight_plans["active"] . ")",
                        "value" => $flight_plans["active"] > 0 ? $flight_plans["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Inativos",
                        "label" => "Inativos (" . $flight_plans["inative"] . ")",
                        "value" => $flight_plans["inative"] > 0 ? $flight_plans["inative"] : "",
                        "color" => "#F47560"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados (" . $flight_plans["deleted"] . ")",
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
                        "label" => "Finalizadas (" . $service_orders["finished"] . ")",
                        "value" => $service_orders["finished"] > 0 ? $service_orders["finished"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Deletadas",
                        "label" => "Deletadas (" . $service_orders["deleted"] . ")",
                        "value" => $service_orders["deleted"] > 0 ? $service_orders["deleted"] : "",
                        "color" => "#F47560"
                    ],
                    [
                        "id" => "Em progresso",
                        "label" => "Em progresso (" . $service_orders["to_finish"] . ")",
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
                        "label" => "Acessíveis (" . $reports["active"] . ")",
                        "value" => $reports["active"] > 0 ? $service_orders["active"] : "",
                        "color" => "#7FC97F"
                    ],
                    [
                        "id" => "Deletados",
                        "label" => "Deletados (" . $reports["deleted"] . ")",
                        "value" => $reports["deleted"] > 0 ? $service_orders["deleted"] : "",
                        "color" => "#F47560"
                    ]
                ]
            ],
            "registrations" => [
                [
                    "id" => "Registros",
                    "data" => $registrations
                ]
            ]

        ], 200);
    }
}
