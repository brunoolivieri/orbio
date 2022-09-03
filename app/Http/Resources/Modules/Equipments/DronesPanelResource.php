<?php

namespace App\Http\Resources\Modules\Equipments;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class DronesPanelResource extends JsonResource
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

        foreach($this->data as $row => $drone){

            $formated_data["records"][$row] = [
                "id" => $drone->id,
                "image_url" => Storage::url("images/drone/".$drone->image->path),
                "name" => $drone->name,
                "manufacturer" => $drone->manufacturer,
                "model" => $drone->model,
                "record_number" => $drone->record_number,
                "serial_number" => $drone->serial_number,
                "weight" => $drone->weight,
                "observation" => $drone->observation,
                "created_at" => date( 'd-m-Y h:i', strtotime($drone->created_at)),
                "updated_at" => empty($drone->updated_at) ? "N/A" : date( 'Y-m-d h:i', strtotime($drone->updated_at))
            ];

        }

        $formated_data["total_records"] = $this->data->total();
        $formated_data["records_per_page"] = $this->data->perPage();
        $formated_data["total_pages"] = $this->data->lastPage();

        return $formated_data;

    }
}
