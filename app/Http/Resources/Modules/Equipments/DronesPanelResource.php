<?php

namespace App\Http\Resources\Modules\Equipments;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
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
                "image_url" => Storage::url($drone->image_path),
                "name" => $drone->name,
                "manufacturer" => $drone->manufacturer,
                "model" => $drone->model,
                "record_number" => $drone->record_number,
                "serial_number" => $drone->serial_number,
                "weight" => $drone->weight,
                "total_service_orders" => $drone->service_orders()->distinct('service_order_id')->count(),
                "total_flight_plans" => $drone->flight_plans()->distinct('service_order_id')->count(),
                "total_incidents" => "",
                "observation" => $drone->observation,
                "created_at" => $drone->created_at,
                "updated_at" => $drone->updated_at,
                "deleted_at" => $drone->deleted_at
            ];

            if ($drone->trashed()) {
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
