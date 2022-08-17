<?php

namespace App\Http\Resources\Modules\Equipments;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class BatteriesPanelResource extends JsonResource
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

        foreach($this->data as $row => $battery){

            $formated_data["records"][$row] = [
                "id" => $battery->id,
                "image_url" => Storage::url("images/battery/".$battery->image),
                "name" => $battery->name,
                "manufacturer" => $battery->manufacturer,
                "model" => $battery->model,
                "serial_number" => $battery->serial_number,
                "last_charge" => empty($battery->last_charge) ? "N/A" : date( 'Y-m-d h:i', strtotime($battery->last_charge)),
                "created_at" => date( 'd-m-Y h:i', strtotime($battery->created_at)),
                "updated_at" => empty($battery->updated_at) ? "N/A" : date( 'd-m-Y h:i', strtotime($battery->updated_at))
            ];

        }

        $formated_data["total_records"] = $this->data->total();
        $formated_data["records_per_page"] = $this->data->perPage();
        $formated_data["total_pages"] = $this->data->lastPage();

        return $formated_data;

    }
}
