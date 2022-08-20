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

       $users = [
        "total" => $this->user_model->withTrashed()->count(),
        "active" => $this->user_model->where("status", 1)->count(),
        "inative" => $this->user_model->where("status", 0)->count(),
        "deleted" => $this->user_model->onlyTrashed()->count()
       ];

       $flight_plans = [
        "total" => $this->flight_plan_model->withTrashed()->count(),
        "active" => $this->flight_plan_model->where("status", 1)->count(),
        "inative" => $this->flight_plan_model->where("status", 0)->count(),
        "deleted" => $this->flight_plan_model->onlyTrashed()->count()
       ];

       $service_orders = [
        "total" => $this->service_order_model->withTrashed()->count(),
        "finished" => $this->service_order_model->whereRaw("service_orders.start_date >= service_orders.end_date")->count(),
        "to_finish" => $this->service_order_model->whereRaw("service_orders.start_date < service_orders.end_date")->count(),
        "deleted" => $this->service_order_model->onlyTrashed()->count()
       ];

       $reports = [
        "total" => $this->report_model->withTrashed()->count(),
        "active" => $this->report_model->count(),
        "deleted" => $this->report_model->onlyTrashed()->count()
       ];

       $registrations = [
            [
                "x" => "Janeiro",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 1)->withTrashed()->count()
            ],
            [
                "x" => "Fevereiro",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 2)->withTrashed()->count()
            ],
            [
                "x" => "Março",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 3)->withTrashed()->count()
            ],
            [
                "x" => "Abril",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 4)->withTrashed()->count()
            ],
            [
                "x" => "Maio",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 5)->withTrashed()->count()
            ],
            [
                "x" => "Junho",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 6)->withTrashed()->count()
            ],
            [
                "x" => "Julho",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 7)->withTrashed()->count()
            ],
            [
                "x" => "Agosto",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 8)->withTrashed()->count()
            ],
            [
                "x" => "Setembro",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 9)->withTrashed()->count()
            ],
            [
                "x" => "Outubro",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 10)->withTrashed()->count()
            ],
            [
                "x" => "Novembro",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 11)->withTrashed()->count()
            ],
            [
                "x" => "Dezembro",
                "y" => $this->user_model->whereYear('created_at', '=', date("Y"))->whereMonth('created_at', '=', 12)->withTrashed()->count()
            ]
        ];

        $logins = [
            [
                "x" => "Janeiro",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 1)->withTrashed()->count()
            ],
            [
                "x" => "Fevereiro",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 2)->withTrashed()->count()
            ],
            [
                "x" => "Março",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 3)->withTrashed()->count()
            ],
            [
                "x" => "Abril",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 4)->withTrashed()->count()
            ],
            [
                "x" => "Maio",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 5)->withTrashed()->count()
            ],
            [
                "x" => "Junho",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 6)->withTrashed()->count()
            ],
            [
                "x" => "Julho",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 7)->withTrashed()->count()
            ],
            [
                "x" => "Agosto",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 8)->withTrashed()->count()
            ],
            [
                "x" => "Setembro",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 9)->withTrashed()->count()
            ],
            [
                "x" => "Outubro",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 10)->withTrashed()->count()
            ],
            [
                "x" => "Novembro",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 11)->withTrashed()->count()
            ],
            [
                "x" => "Dezembro",
                "y" => $this->user_model->whereYear('last_access', '=', date("Y"))->whereMonth('last_access', '=', 12)->withTrashed()->count()
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
                        "label" => "Ativos (".$users["active"].")", 
                        "value" => $users["active"] > 0 ? $users["active"] : ""
                    ],
                    [
                        "id" => "Inativos", 
                        "label" => "Inativos (".$users["inative"].")", 
                        "value" => $users["inative"] > 0 ? $users["inative"] : ""
                    ],
                    [
                        "id" => "Deletados", 
                        "label" => "Deletados (".$users["deleted"].")", 
                        "value" => $users["deleted"] > 0 ? $users["deleted"] : ""
                    ]
                ]
            ],
            "flight_plans" => [
                "total" => $flight_plans["total"],
                "chart" => [
                    [
                        "id" => "Ativos", 
                        "label" => "Ativos (".$flight_plans["active"].")", 
                        "value" => $flight_plans["active"] > 0 ? $flight_plans["active"] : ""
                    ],
                    [
                        "id" => "Inativos", 
                        "label" => "Inativos (".$flight_plans["inative"].")", 
                        "value" => $flight_plans["inative"] > 0 ? $flight_plans["inative"] : ""
                    ],
                    [
                        "id" => "Deletados", 
                        "label" => "Deletados (".$flight_plans["deleted"].")", 
                        "value" => $flight_plans["deleted"] > 0 ? $flight_plans["deleted"] : ""
                    ]
                ]
            ],
            "service_orders" => [
                "total" => $service_orders["total"],
                "chart" => [
                    [
                        "id" => "Finalizadas", 
                        "label" => "Finalizadas (".$service_orders["finished"].")", 
                        "value" => $service_orders["finished"] > 0 ? $service_orders["finished"] : ""
                    ],
                    [
                        "id" => "Deletadas", 
                        "label" => "Deletadas (".$service_orders["deleted"].")", 
                        "value" => $service_orders["deleted"] > 0 ? $service_orders["deleted"] : ""
                    ],
                    [
                        "id" => "Em progresso", 
                        "label" => "Em progresso (".$service_orders["to_finish"].")", 
                        "value" => $service_orders["to_finish"] > 0 ? $service_orders["to_finish"] : ""
                    ]
                ]
            ],
            "reports" => [
                "total" => $reports["total"],
                "chart" => [
                    [
                        "id" => "Acessíveis", 
                        "label" => "Acessíveis (".$reports["active"].")", 
                        "value" => $reports["active"] > 0 ? $service_orders["active"] : ""
                    ],
                    [
                        "id" => "Deletados", 
                        "label" => "Deletados (".$reports["deleted"].")", 
                        "value" => $reports["deleted"] > 0 ? $service_orders["deleted"] : ""
                    ]
                ]     
            ],
            "registrations" => [
                [
                "id" => "Registros",
                "data" => $registrations
                ]
            ],
            "logins" => [
                [
                    "id" => "Acessos",
                    "data" => $logins
                ]
            ]
                
        ], 200);
    }
}
