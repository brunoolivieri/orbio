<?php

namespace App\Http\Resources\Modules\Equipments;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class EquipmentsPanelResource extends JsonResource
{

    private LengthAwarePaginator $data;

    function __construct(LengthAwarePaginator $data){
        $this->data = $data;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {

        $formated_data["records"] = array();

        foreach($this->data as $row => $equipment){

            $formated_data["records"][$row] = [
                "id" => $equipment->id,
                "image_url" => Storage::url("images/equipment/".$equipment->image),
                "name" => $equipment->name,
                "manufacturer" => $equipment->manufacturer,
                "model" => $equipment->model,
                "record_number" => $equipment->record_number,
                "serial_number" => $equipment->serial_number,
                "weight" => $equipment->weight,
                "observation" => $equipment->observation,
                "purchase_date" => empty($equipment->purchase_date) ? "N/A" : date( 'Y-m-d h:i', strtotime($equipment->purchase_date)),
                "created_at" => date( 'd-m-Y h:i', strtotime($equipment->created_at)),
                "updated_at" => empty($equipment->updated_at) ? "N/A" : date( 'd-m-Y h:i', strtotime($equipment->updated_at))
            ];

        }

        $formated_data["total_records"] = $this->data->total();
        $formated_data["records_per_page"] = $this->data->perPage();
        $formated_data["total_pages"] = $this->data->lastPage();

        return $formated_data;

    }
}
