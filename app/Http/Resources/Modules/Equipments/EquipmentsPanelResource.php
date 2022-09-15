<?php

namespace App\Http\Resources\Modules\Equipments;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class EquipmentsPanelResource extends JsonResource
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
        foreach ($this->data as $row => $equipment) {

            $this->formatedData["records"][$row] = [
                "id" => $equipment->id,
                "image_url" => Storage::url("images/equipments/" . $equipment->image->path),
                "name" => $equipment->name,
                "manufacturer" => $equipment->manufacturer,
                "model" => $equipment->model,
                "record_number" => $equipment->record_number,
                "serial_number" => $equipment->serial_number,
                "weight" => $equipment->weight,
                "observation" => $equipment->observation,
                "purchase_date" => empty($equipment->purchase_date) ? "N/A" : strtotime($equipment->purchase_date),
                "created_at" => strtotime($equipment->created_at),
                "updated_at" => empty($equipment->updated_at) ? "N/A" : strtotime($equipment->updated_at)
            ];
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
