<?php

namespace App\Http\Controllers\v1\Modules\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Users\User;
use App\Models\Profiles\Profile;
use App\Models\FlightPlans\FlightPlan;
use App\Models\ServiceOrders\ServiceOrder;
use App\Models\Reports\Report;

class DashboardController extends Controller
{
    private array $data = [];
    private string $cardData = "";

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

            foreach ($collections as $collection_key => $collection) {
                $this->defineCollectionData($collection_key, $collection);
                $this->getCollectionData($collection_key, $collection);
            }

            return response($this->data, 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    private function defineCollectionData($collection_key, $collection)
    {

        // Generic cases
        $this->data[$collection_key]["total"] = $collection->count();
        $this->data[$collection_key]["data"] = [];
        $this->data[$collection_key]["data"][0] = [
            "label" => "Ativos",
            "text" => "Registros não deletados",
            "value" => 0
        ];
        $this->data[$collection_key]["data"][1] = [
            "label" => "Deletados",
            "text" => "Registros deletados",
            "value" => 0
        ];

        // Specific cases
        if ($collection_key === "users") {
            $this->data[$collection_key]["data"][0]["text"] = "Usuários com acesso e ativos";
            $this->data["users"]["data"][2] = [
                "label" => "Inativos",
                "value" => 0,
                "text" => "Usuários sem acesso"
            ];
        } else if ($collection_key === "service_orders") {
            $this->data[$collection_key]["data"][2] = [
                "label" => "Expiradas",
                "value" => 0,
                "text" => "Expiradas e sem relatório"
            ];
            $this->data[$collection_key]["data"][3] = [
                "label" => "Finalizadas",
                "value" => 0,
                "text" => "Finalizadas com relatório"

            ];
            $this->data[$collection_key]["data"][4] = [
                "label" => "Em progresso",
                "value" => 0,
                "text" => "Ativas e em andamento"
            ];
        }
    }

    private function getCollectionData($collection_key, $collection)
    {

        foreach ($collection as $item) {
            if ($item->trashed()) {
                $this->data[$collection_key]["data"][1]["value"]++;
            } else {
                if ($collection_key === "users") {

                    if (is_null($item->last_access)) {
                        $this->data["users"]["data"][2]["value"]++;
                    } else {
                        $this->data["users"]["data"][0]["value"]++;
                    }
                } else if ($collection_key === "service_orders") {

                    if (is_null($item->report_id) && time() > $item->end_date) {
                        $this->data["service_orders"]["data"][2]["value"]++;
                    } else if (!is_null($item->report_id)) {
                        $this->data["service_orders"]["data"][3]["value"]++;
                    } else if (is_null($item->report_id) && time() < $item->end_date) {
                        $this->data["service_orders"]["data"][0]["value"]++;
                    }
                } else {
                    $this->data[$collection_key]["data"][0]["value"]++;
                }
            }
        }
    }
}
