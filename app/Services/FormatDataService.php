<?php

namespace App\Services;

use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Modules\ModuleModel;
use App\Models\Pivot\ServiceOrderHasUserModel;
use App\Models\Pivot\ServiceOrderHasFlightPlanModel;

class FormatDataService {

    private array $formated_data = array();

    /**
     * Method for organize genericaly data for the frontend table.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array $this->$formated_data
     */
    public function genericDataFormatting(LengthAwarePaginator $data){

        foreach($data->items() as $row => $record){

            foreach($record as $column => $value){

                if($column == "created_at" || $column == "updated_at" || $column == "deleted_at"){
                    $this->$formated_data[$row][$column] = empty($value) ? "Sem dados" : $this->formatTimestamps($value);
                }else{
                    $this->$formated_data[$row][$column] = empty($value) ? "Sem dados" : $value;
                }

            }
        }

        $this->$formated_data["total_records_founded"] = $data->total();
        $this->$formated_data["records_per_page"] = $data->perPage();
        $this->$formated_data["total_pages"] = $data->lastPage();

        return $this->$formated_data;

    }

    /**
     * Method for organize data for the users administration table.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array $this->$formated_data
     */
    public function userPanelDataFormatting(LengthAwarePaginator $data){

        foreach($data->items() as $row => $record){

            foreach($record as $column => $value){

                if($column == "created_at" || $column == "updated_at" || $column == "deleted_at"){
                    $this->$formated_data[$row][$column] = empty($value) ? "Sem dados" : $this->formatTimestamps($value);
                }else{
                    $this->$formated_data[$row][$column] = empty($value) ? "Sem dados" : $value;
                }

            }

            if($record->status == 1){

                $this->$formated_data[$row]["status_badge"] = ["Ativo", "success"];
            
            }else if($record->status == 0 && $record->dh_ultimo_acesso == null){

                $this->$formated_data[$row]["status_badge"] = ["Inativo", "error"];
            
            }else if($record->status == 0 && $record->dh_ultimo_acesso != null){

                $this->$formated_data[$row]["status_badge"] = ["Desativado", "error"];

            }
        }

        $this->$formated_data["total_records_founded"] = $data->total();
        $this->$formated_data["records_per_page"] = $data->perPage();
        $this->$formated_data["total_pages"] = $data->lastPage();

        return $this->$formated_data;

    }

    /**
     * Method for organize data for the profiles administration table.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array $this->$formated_data
     */
    public function profilePanelDataFormatting(LengthAwarePaginator $data){

        $number_of_modules = ModuleModel::all()->count();
        $actual_profile_privileges = array();
        $actual_profile = 0;

        // Each profile relationship with each module is defined in one row
        // Thus, if theres X modules, for example, each profile will appears X times in the pivot table
        // The code below put all the profiles and modules relationships into "modules" array key

        foreach($data->items() as $row => $record){

            // The $actual_profile will be the same for $number_of_modules loop or until the module id is not equal to $number_of_modules
            // For each actual profile row the module change - of course, because each row defines a relationship of actual profile with one of the modules

            $this->$formated_data[$actual_profile] = ["profile_id" => $record->id_perfil, "profile_name" =>  $record->nome_perfil, "modules" => array()]; 

            $module_name = explode(" ", $record->nome)[0];
            $actual_profile_privileges[$record->id_modulo] = ["module_name" => $module_name, "profile_powers" => ["ler" => $record->ler, "escrever" => $record->escrever]];

            // If its true, this is the last module
            if($record->id_modulo == $number_of_modules){

                // The actual profile relationships are stored
                $this->$formated_data[$actual_profile]["modules"] = $actual_profile_privileges;
                $actual_profile++;

            }
        }

    }

    public function serviceOrderPanelDataFormatting(LengthAwarePaginator $data){

    }

    private function formatTimestamps($datetime){
        return date( 'd-m-Y h:i', strtotime($datetime));
    }




}