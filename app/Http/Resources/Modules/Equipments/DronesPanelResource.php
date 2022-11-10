<?php

namespace App\Http\Resources\Modules\Equipments;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use App\Models\FlightPlans\FlightPlan;

class DronesPanelResource extends JsonResource
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
        foreach ($this->data as $row => $drone) {

            $this->formatedData["records"][$row] = [
                "id" => $drone->id,
                "image_url" => Storage::url($drone->image->path),
                "name" => $drone->name,
                "manufacturer" => $drone->manufacturer,
                "model" => $drone->model,
                "record_number" => $drone->record_number,
                "serial_number" => $drone->serial_number,
                "weight" => $drone->weight,
                "service_orders" => [],
                "total_incidents" => "",
                "observation" => $drone->observation,
                "created_at" => date("d-m-Y", strtotime($drone->created_at)),
                "updated_at" => date("d-m-Y", strtotime($drone->updated_at))
            ];

            // Get related service orders
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
