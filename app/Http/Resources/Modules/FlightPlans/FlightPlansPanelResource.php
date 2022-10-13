<?php

namespace App\Http\Resources\Modules\FlightPlans;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Incidents\Incident;

class FlightPlansPanelResource extends JsonResource
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
        foreach ($this->data as $flight_plan_row => $flight_plan) {

            $this->formatedData["records"][$flight_plan_row] = [
                "id" => $flight_plan->id,
                "creator" => [
                    "name" => $flight_plan->user->name,
                    "email" => $flight_plan->user->email,
                    "deleted_at" => $flight_plan->user->deleted_at
                ],
                "name" => $flight_plan->name,
                "service_orders" => [],
                "logs" => [],
                "incidents" => 0, //$flight_plan->pivot->incident_id
                "file" => $flight_plan->file,
                "localization" => [
                    "coordinates" => $flight_plan->coordinates,
                    "state" => $flight_plan->state,
                    "city" => $flight_plan->city
                ],
                "description" => $flight_plan->description,
                "created_at" => date('d/m/Y', strtotime($flight_plan->created_at)),
                "updated_at" => empty($flight_plan->updated_at) ? "N/A" : date('d-m-Y h:i', strtotime($flight_plan->updated_at))
            ];

            // ==== SERVICE ORDERS AND INCIDENTS RELATED TO THIS FLIGHT PLAN ==== //

            // If flight plan is beign used in a service order
            if (!empty($flight_plan->service_orders)) {

                foreach ($flight_plan->service_orders as $service_order_row => $service_order) {

                    // Incidents ocurrs with flight plans IN service orders
                    $flight_plan_service_order_incidents = Incident::where("service_order_flight_plan_id", $service_order->pivot->id)->get();

                    $this->formatedData["records"][$flight_plan_row]["service_orders"][$service_order_row] = [
                        "id" => $service_order->id,
                        "number" => $service_order->number,
                        "status" => $service_order->status,
                        "created_at" => strtotime($service_order->created_at),
                        "incidents" => $flight_plan_service_order_incidents // incidents in this service order
                    ];

                    $this->formatedData["records"][$flight_plan_row]["incidents"] += $flight_plan_service_order_incidents->count();
                }
            }

            // ==== SERVICE ORDERS AND INCIDENTS RELATED TO THIS FLIGHT PLAN ==== //

            // If flight plan has logs
            if (!empty($flight_plan->logs)) {

                foreach ($flight_plan->logs as $log_row => $log) {

                    $this->formatedData["records"][$flight_plan_row]["logs"][$log_row] = [
                        "id" => $log->id,
                        "name" => $log->name,
                        "path" => $log->path,
                        "timestamp" => date('d-m-Y h:i', strtotime($log->timestamp)),
                        "created_at" => $log->created_at,
                        "deleted_at" => $log->deleted_at
                    ];
                }
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
