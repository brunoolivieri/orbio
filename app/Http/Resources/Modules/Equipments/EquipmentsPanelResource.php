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

    public function toArray($request)
    {
        foreach ($this->data as $row => $equipment) {

            $this->formatedData["records"][$row] = [
                "id" => $equipment->id,
                "image_url" => Storage::url($equipment->image_path),
                "name" => $equipment->name,
                "manufacturer" => $equipment->manufacturer,
                "model" => $equipment->model,
                "record_number" => $equipment->record_number,
                "serial_number" => $equipment->serial_number,
                "weight" => $equipment->weight,
                "observation" => $equipment->observation,
                "purchase_date" => empty($equipment->purchase_date) ? "nunca" : $equipment->purchase_date,
                "created_at" => $equipment->created_at,
                "updated_at" => $equipment->updated_at,
                "deleted_at" => $equipment->deleted_at
            ];

            if ($equipment->trashed()) {
                $this->formatedData["records"][$row]["status_badge"] = [
                    "label" => "Deletado",
                    "color" => "error"
                ];
            } else {
                $this->formatedData["records"][$row]["status_badge"] = [
                    "label" => "Ativo",
                    "color" => "success"
                ];
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
