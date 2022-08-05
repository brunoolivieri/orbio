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


}