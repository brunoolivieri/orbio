<?php

namespace App\Http\Resources\Modules\Incidents;

use App\Models\FlightPlans\FlightPlan;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class IncidentsPanelResource extends JsonResource
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
        foreach ($this->data as $row => $incident) {

            $this->formatedData["records"][$row] = [
                "id" => $incident->id,
                "type" => $incident->type,
                "description" => $incident->description,
                "date" => date('Y-m-d', strtotime($incident->date)),
                "created_at" => date('Y-m-d', strtotime($incident->created_at)),
                "updated_at" => empty($incident->updated_at) ? "N/A" : date('Y-m-d', strtotime($incident->updated_at))
            ];

            // Get related service order // Table "service_order_flight_plan"
            $service_order = $incident->service_order_flight_plan->service_order;

            $this->formatedData["records"][$row]["service_order"] = [
                "id" => $service_order->id,
                "number" => $service_order->number,
                "status" => $service_order->status,
                "created_at" => strtotime($service_order->created_at)
            ];

            // Get related flight plan // Table "service_order_flight_plan"
            $flight_plan = $incident->service_order_flight_plan->flight_plan;

            $this->formatedData["records"][$row]["service_order"]["flight_plan"] = [
                "id" => $flight_plan->id,
                "creator" => [
                    "name" => $flight_plan->user->name,
                    "email" => $flight_plan->user->email,
                    "deleted_at" => $flight_plan->user->deleted_at
                ],
                "name" => $flight_plan->name,
                "logs" => $flight_plan->logs,
                "incidents" => [], //$flight_plan->pivot->incident_id
                "file" => $flight_plan->file,
                "localization" => [
                    "coordinates" => $flight_plan->coordinates,
                    "state" => $flight_plan->state,
                    "city" => $flight_plan->city
                ]
            ];
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
