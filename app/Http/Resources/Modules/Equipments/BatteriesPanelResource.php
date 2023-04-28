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

    public function toArray($request)
    {
        foreach ($this->data as $row => $battery) {

            $this->formatedData["records"][$row] = [
                "id" => $battery->id,
                "image_url" => Storage::url($battery->image_path),
                "name" => $battery->name,
                "manufacturer" => $battery->manufacturer,
                "model" => $battery->model,
                "serial_number" => $battery->serial_number,
                "last_charge" => empty($battery->last_charge) ? "nunca" : $battery->last_charge,
                "observation" => $battery->observation,
                "created_at" => $battery->created_at,
                "updated_at" => $battery->updated_at,
                "deleted_at" => $battery->deleted_at
            ];

            if ($battery->trashed()) {
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
