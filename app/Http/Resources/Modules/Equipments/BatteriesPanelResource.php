<?php

namespace App\Http\Resources\Modules\Equipments;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class BatteriesPanelResource extends JsonResource
{

    private LengthAwarePaginator $data;
    private array $formatedData = [];

    function __construct(LengthAwarePaginator $data)
    {
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
        foreach ($this->data as $row => $battery) {

            $this->formatedData["records"][$row] = [
                "id" => $battery->id,
                "image_url" => Storage::url("images/battery/" . $battery->image->path),
                "name" => $battery->name,
                "manufacturer" => $battery->manufacturer,
                "model" => $battery->model,
                "serial_number" => $battery->serial_number,
                "last_charge" => empty($battery->last_charge) ? "N/A" : strtotime($battery->last_charge),
                "created_at" => strtotime($battery->created_at),
                "updated_at" => empty($battery->updated_at) ? "N/A" : strtotime($battery->updated_at)
            ];
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
