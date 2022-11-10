<?php

namespace App\Http\Resources\Modules\FlightPlans;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Incidents\Incident;
use App\Models\Logs\Log;

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
                "total_incidents" => 0,
                "total_logs" => 0,
                "file" => $flight_plan->file,
                "localization" => [
                    "coordinates" => $flight_plan->coordinates,
                    "state" => $flight_plan->state,
                    "city" => $flight_plan->city
                ],
                "description" => $flight_plan->description,
                "created_at" => date("Y-m-d", strtotime($flight_plan->created_at)),
                "updated_at" => date("Y-m-d", strtotime($flight_plan->updated_at))
            ];

            // ==== SERVICE ORDERS AND INCIDENTS RELATED TO THIS FLIGHT PLAN ==== //

            // If flight plan is beign used in a service order
            if (!empty($flight_plan->service_orders)) {

                foreach ($flight_plan->service_orders as $service_order_row => $service_order) {

                    // Incidents of flight plan IN service orders
                    $incidents = Incident::where("service_order_flight_plan_id", $service_order->pivot->id)->get();
                    $logs = Log::where("service_order_flight_plan_id", $service_order->pivot->id)->get();

                    $this->formatedData["records"][$flight_plan_row]["service_orders"][$service_order_row] = [
                        "id" => $service_order->id,
                        "number" => $service_order->number,
                        "status" => $service_order->status,
                        "created_at" => strtotime($service_order->created_at),
                        "incidents" => $incidents, // incidents of flight plan in this service order
                        "logs" => $logs // logs of flight plan in this service order
                    ];

                    $this->formatedData["records"][$flight_plan_row]["total_incidents"] += $incidents->count();
                    $this->formatedData["records"][$flight_plan_row]["total_logs"] += $logs->count();
                }
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
