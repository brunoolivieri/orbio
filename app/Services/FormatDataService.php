<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Pagination\LengthAwarePaginator;
// Custom
use App\Models\Modules\ModuleModel;
use App\Models\Pivot\ServiceOrderHasUserModel;
use App\Models\Pivot\ServiceOrderHasFlightPlanModel;

class FormatDataService {

    private array $formated_data = array();

    /**
     * Method for organize genericaly data for the frontend table.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array $this->formated_data
     */
    public function genericDataFormatting(LengthAwarePaginator $data){

        foreach($data->items() as $row => $record){

            foreach($record as $column => $value){

                if($column == "created_at" || $column == "updated_at" || $column == "deleted_at" || $column ==  "last_access" || $column == "start_date" || $column == "end_date" || $column == "last_charge" || $column == "purchase_date"){
                    $this->formated_data["records"][$row][$column] = empty($value) ? "Sem data" : date( 'd-m-Y h:i', strtotime($value));
                }else{
                    $this->formated_data["records"][$row][$column] = $value;
                }

            }
        }

        $this->formated_data["total_records_founded"] = $data->total();
        $this->formated_data["records_per_page"] = $data->perPage();
        $this->formated_data["total_pages"] = $data->lastPage();

        return $this->formated_data;

    }

    /**
     * Method for organize profile and modules relationship.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array $this->formated_data
     */
    public function modulesProfileDataFormatting($data) : array {

        foreach($data as $row => $record){

            $module_name_splited = explode(" ", ModuleModel::find($record->module_id));

            $this->formated_data[$record->module_id] = ["module" => $module_name_splited[0], "profile_powers" => ["read" => $record->read, "write" => $record->write]];

        }

        return $this->formated_data;

    }

    /**
     * Method for organize data for the service orders table.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array $this->formated_data
     */
    public function serviceOrderPanelDataFormatting(LengthAwarePaginator $data){

        foreach($data->items() as $row => $service_order){

            // ====== GENERIC COLUMNS ====== //
            foreach($service_order as $column => $value){

                if($column == "created_at" || $column == "updated_at" || $column == "deleted_at"){
                    $this->formated_data["records"][$row][$column] = empty($value) ? "Sem data" : date( 'd-m-Y h:i', strtotime($value));
                }else{
                    $this->formated_data["records"][$row][$column] = $value;
                }

            }

            // ====== RELATED FLIGHT PLANS ====== //
            $service_order_flight_plans = ServiceOrderHasFlightPlanModel::where("service_order_id", $service_order->id)->get();
            $flight_plans_vinculated = [];
            for($count = 0; $count < count($service_order_flight_plans); $count++){

                $actual_flight_plan["id"] = $service_order_flight_plans[$count]->flight_plans->id;
                $actual_flight_plan["file"] = $service_order_flight_plans[$count]->flight_plans->file;
                $actual_flight_plan["status"] = $service_order_flight_plans[$count]->flight_plans->status;

                array_push($flight_plans_vinculated, $actual_flight_plan);
            }
            $this->formated_data["records"][$row]["flight_plans"] = $flight_plans_vinculated;

            // ====== RELATED USERS ====== //
            $service_order_has_user = ServiceOrderHasUserModel::where("service_order_id", $service_order->id)->get();
            $index = 0;

            // If service order has a creator
            if(isset($service_order_has_user[0]->has_creator)){

                // Get creator data
                $this->formated_data["records"][$row]["creator"]["id"] = $service_order_has_user[0]->has_creator->id;
                $this->formated_data["records"][$row]["creator"]["profile_id"] = $service_order_has_user[0]->has_creator->profile_id;
                $this->formated_data["records"][$row]["creator"]["name"] = $service_order_has_user[0]->has_creator->name;
                $this->formated_data["records"][$row]["creator"]["status"] = $service_order_has_user[0]->has_creator->status;

            }else{

                $this->formated_data["records"][$row]["creator"]["id"] = 0;

            }

            // If service order has a pilot
            if(isset($service_order_has_user[0]->has_pilot)){

                // Get pilot data
               $this->formated_data["records"][$row]["pilot"]["id"] = $service_order_has_user[0]->has_pilot->id;
               $this->formated_data["records"][$row]["pilot"]["profile_id"] = $service_order_has_user[0]->has_pilot->profile_id;
               $this->formated_data["records"][$row]["pilot"]["name"] = $service_order_has_user[0]->has_pilot->name;
               $this->formated_data["records"][$row]["pilot"]["status"] = $service_order_has_user[0]->has_pilot->status;

            }else{

                $this->formated_data["records"][$row]["pilot"]["id"] = 0;

            }

            // If service order has a client
            if(isset($service_order_has_user[0]->has_client)){

                // Get client data
                $this->formated_data["records"][$row]["client"]["id"] = $service_order_has_user[0]->has_client->id;
                $this->formated_data["records"][$row]["client"]["profile_id"] = $service_order_has_user[0]->has_client->profile_id;
                $this->formated_data["records"][$row]["client"]["name"] = $service_order_has_user[0]->has_client->name;
                $this->formated_data["records"][$row]["client"]["status"] = $service_order_has_user[0]->has_client->status;

            }else{

                $this->formated_data["records"][$row]["client"]["id"] = 0;

            }
            
        }

        $this->formated_data["total_records_founded"] = $data->total();
        $this->formated_data["records_per_page"] = $data->perPage();
        $this->formated_data["total_pages"] = $data->lastPage();

        return $this->formated_data;

    }


}