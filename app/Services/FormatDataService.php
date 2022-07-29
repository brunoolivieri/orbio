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
     * Method for organize data for the users administration table.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array $this->formated_data
     */
    public function userPanelDataFormatting(LengthAwarePaginator $data){

        foreach($data->items() as $row => $record){

            foreach($record as $column => $value){

                if($column === "created_at" || $column === "updated_at" || $column === "deleted_at" || $column === "last_access"){
                    $this->formated_data["records"][$row][$column] = empty($value) ? "Sem data" : date( 'd-m-Y h:i', strtotime($value));
                }else{
                    $this->formated_data["records"][$row][$column] = $value;
                }

            }

            if($record->status == 1){

                $this->formated_data["records"][$row]["status_badge"] = ["Ativo", "success"];
            
            }else if($record->status == 0 && $record->last_access == null){

                $this->formated_data["records"][$row]["status_badge"] = ["Inativo", "error"];
            
            }else if($record->status == 0 && $record->last_access != null){

                $this->formated_data["records"][$row]["status_badge"] = ["Desativado", "error"];

            }
        }

        $this->formated_data["total_records_founded"] = $data->total();
        $this->formated_data["records_per_page"] = $data->perPage();
        $this->formated_data["total_pages"] = $data->lastPage();

        return $this->formated_data;

    }

    /**
     * Method for organize data for the profiles administration table.
     * Each profile relationship with each module is defined in one row.
     * Thus, if there's N modules, for example, each profile will appears N times in the pivot table.
     * This function put each profile rows group into ["records"][$actual_profile]["modules"].
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array $this->formated_data
     */
    public function profilePanelDataFormatting(LengthAwarePaginator $data) : array {

        $number_of_modules = ModuleModel::all()->count();
        $arr_with_formated_records = array();
        $actual_profile_privileges = array();
        $actual_profile = 0;

        foreach($data->items() as $row => $record){

            // The $actual_profile will be the same for $number_of_modules loop or until the module id is not equal to $number_of_modules
            // For each actual profile row the module change - of course, because each row defines a relationship of actual profile with one of the modules

            $this->formated_data["records"][$actual_profile] = ["profile_id" => $record->profile_id, "profile_name" =>  $record->profile_name, "modules" => array()]; 

            $module_name = explode(" ", $record->name)[0];
            $actual_profile_privileges[$record->module_id] = ["module_name" => $module_name, "profile_powers" => ["read" => $record->read, "write" => $record->write]];

            // If this is the last module
            if($record->module_id == $number_of_modules){

                // The actual profile relationships are stored
                $this->formated_data["records"][$actual_profile]["modules"] = $actual_profile_privileges;
                $actual_profile+=1;

            }
        }

        // If each group of $number_of_modules rows is transformed into one, the total records need to be divided by $number_of_modules 
        $this->formated_data["total_records"] = $data->total()/$number_of_modules;
        $this->formated_data["records_per_page"] = $data->perPage()/$number_of_modules;
        $this->formated_data["total_pages"] = $data->lastPage();

        return $this->formated_data;

    }

    /**
     * Method for organize data for the service orders table.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array $this->formated_data
     */
    public function serviceOrderPanelDataFormatting(LengthAwarePaginator $data){

        dd($data);

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
            if(!empty($service_order_has_user->creator_id)){

                // Get creator data
                $this->formated_data["records"][$row]["creator"]["id"] = $service_order_has_user[$index]->users("creator_id")->id;
                $this->formated_data["records"][$row]["creator"]["profile_id"] = $service_order_has_user[$index]->users("creator_id")->profile_id;
                $this->formated_data["records"][$row]["creator"]["name"] = $service_order_has_user[$index]->users("creator_id")->name;
                $this->formated_data["records"][$row]["creator"]["status"] = $service_order_has_user[$index]->users("creator_id")->status;

                $index++;

            }else{

                $this->formated_data["records"][$row]["creator"]["id"] = 0;

            }

            // If service order has a pilot
            if(!empty($service_order_has_user->pilot_id)){

                // Get pilot data
               $this->formated_data["records"][$row]["pilot"]["id"] = $service_order_has_user[$index]->users("pilot_id")->id;
               $this->formated_data["records"][$row]["pilot"]["profile_id"] = $service_order_has_user[$index]->users("pilot_id")->profile_id;
               $this->formated_data["records"][$row]["pilot"]["name"] = $service_order_has_user[$index]->users("pilot_id")->name;
               $this->formated_data["records"][$row]["pilot"]["status"] = $service_order_has_user[$index]->users("pilot_id")->status;

                $index++;

            }else{

                $this->formated_data["records"][$row]["pilot"]["id"] = 0;

            }

            // If service order has a client
            if(!empty($service_order_has_user->client_id)){

                // Get client data
                $this->formated_data["records"][$row]["client"]["id"] = $service_order_has_user[$index]->users("client_id")->id;
                $this->formated_data["records"][$row]["client"]["profile_id"] = $service_order_has_user[$index]->users("client_id")->profile_id;
                $this->formated_data["records"][$row]["client"]["name"] = $service_order_has_user[$index]->users("client_id")->name;
                $this->formated_data["records"][$row]["client"]["status"] = $service_order_has_user[$index]->users("client_id")->status;

                $index++;

            }else{

                $this->formated_data["records"][$row]["client"]["id"] = 0;

            }
            
        }

        $this->formated_data["total_records_founded"] = $data->total();
        $this->formated_data["records_per_page"] = $data->perPage();
        $this->formated_data["total_pages"] = $data->lastPage();

        return $this->formated_data;

    }

    /**
     * Method for organize data for drones, batteries and equipment tables.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @param string $type 
     * @return array $this->formated_data
     */
    public function genericEquipmentDataFormatting(LengthAwarePaginator $data, string $equipment){

        foreach($data->items() as $row => $record){

            foreach($record as $column => $value){

                if($column == "created_at" || $column == "updated_at" || $column == "deleted_at" || $column ==  "last_access" || $column == "start_date" || $column == "end_date"){
                    $this->formated_data["records"][$row][$column] = empty($value) ? "Sem data" : date( 'd-m-Y h:i', strtotime($value));
                }else if($column == "image"){
                    $this->formated_data["records"][$row]["image_url"] = Storage::url("images/$equipment/".$value);
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


}