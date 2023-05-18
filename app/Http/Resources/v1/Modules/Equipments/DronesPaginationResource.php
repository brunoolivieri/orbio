<?php

namespace App\Http\Resources\v1\Modules\Equipments;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class DronesPaginationResource extends JsonResource
{
    private LengthAwarePaginator $data;
    private array $formatedData = [];

    function __construct(LengthAwarePaginator $data)
    {
        $this->data = $data;
    }

    public function toArray($request)
    {
        foreach ($this->data as $row => $drone) {

            $this->formatedData["records"][$row] = [
                "id" => $drone->id,
                "image_url" => Storage::url($drone->image_path),
                "name" => $drone->name,
                "manufacturer" => $drone->manufacturer,
                "model" => $drone->model,
                "record_number" => $drone->record_number,
                "serial_number" => $drone->serial_number,
                "weight" => $drone->weight,
                "observation" => $drone->observation,
                "created_at" => $drone->created_at,
                "updated_at" => $drone->updated_at,
                "deleted_at" => $drone->deleted_at
            ];

            if ($drone->trashed()) {
                $this->formatedData["records"][$row]["status_badge"] = [
                    "label" => "Desabilitado",
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
