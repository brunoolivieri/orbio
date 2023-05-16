<?php

namespace App\Http\Controllers\v1\Modules\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Users\User;
use App\Models\Profiles\Profile;
use App\Models\FlightPlans\FlightPlan;
use App\Models\ServiceOrders\ServiceOrder;
use App\Models\Reports\Report;
use Illuminate\Support\Facades\Gate;

define("ITEM_DEFAULT", ["label" => "", "text" => "", "value" => 0]);

class DashboardController extends Controller
{
    private array $collections = [];
    private array $collectionsData = [];

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

            $this->defineCollections();
            $this->defineCollectionsData();

            foreach ($this->collections as $collection_key => $collection) {
                $this->fillCollectionsData($collection_key, $collection);
            }

            return response($this->collectionsData, 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    private function defineCollections()
    {
        if (Gate::allows('administration_read')) {
            $this->collections["users"] = $this->userModel->withTrashed()->get();
            $this->collections["profiles"] = $this->profileModel->withTrashed()->get();
        }

        if (Gate::allows('flight_plans_read')) {
            $this->collections["flight_plans"] = $this->flightPlanModel->withTrashed()->get();
        }

        if (Gate::allows("service_orders_read")) {
            $this->collections["service_orders"] = $this->serviceOrderModel->withTrashed()->get();
        }

        if (Gate::allows("reports_read")) {
            $this->collections["reports"] = $this->reportModel->withTrashed()->get();
        }
    }

    private function defineCollectionsData()
    {

        // 0 = active, 1 = deleted, 2,3,4 = extra cases

        foreach ($this->collections as $collection_key => $collection) {

            $values = [
                "total" => $collection->count(),
                "data" => [
                    0 => [
                        "label" => "Ativos",
                        "text" => "Não deletados",
                        "value" => 0
                    ],
                    1 => [
                        "label" => "Desabilitados",
                        "text" => "Deletados de forma reversível",
                        "value" => 0
                    ]
                ]
            ];

            if ($collection_key === "users") {
                $values["data"][0]["text"] = "Acessaram e estão ativos";
                $values["data"][2] = [
                    "label" => "Inativos",
                    "text" => "Nunca acessaram",
                    "value" => 0
                ];
            } else if ($collection_key === "service_orders") {
                $values["data"][2] = [
                    "label" => "Pendentes",
                    "text" => "Expirados e sem relatório",
                    "value" => 0
                ];
                $values["data"][3] = [
                    "label" => "Finalizados",
                    "text" => "Finalizados com relatório",
                    "value" => 0
                ];;
                $values["data"][4] = [
                    "label" => "Em progresso",
                    "text" => "Ativas e em andamento",
                    "value" => 0
                ];;
            }

            $this->collectionsData[$collection_key] = $values;
        }
    }

    private function fillCollectionsData($collection_key, $collection)
    {
        foreach ($collection as $collection_item) {

            if ($collection_item->trashed()) {
                $this->collectionsData[$collection_key]["data"][1]["value"]++;
            } else {

                if ($collection_key === "users") {

                    if (is_null($collection_item->last_access)) {
                        $this->collectionsData["users"]["data"][2]["value"]++;
                    } else {
                        $this->collectionsData[$collection_key]["data"][0]["value"]++;
                    }
                } else if ($collection_key === "service_orders") {

                    $this->collectionsData[$collection_key]["data"][0]["value"]++;

                    if (is_null($collection_item->report_id) && time() > $collection_item->end_date) {
                        $this->collectionsData["service_orders"]["data"][2]["value"]++;
                    } else if (!is_null($collection_item->report_id)) {
                        $this->collectionsData["service_orders"]["data"][3]["value"]++;
                    } else if (is_null($collection_item->report_id) && time() < $collection_item->end_date) {
                        $this->collectionsData["service_orders"]["data"][4]["value"]++;
                    }
                } else {
                    $this->collectionsData[$collection_key]["data"][0]["value"]++;
                }
            }
        }
    }
}
