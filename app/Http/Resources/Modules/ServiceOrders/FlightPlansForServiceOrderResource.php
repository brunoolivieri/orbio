<?php

namespace App\Http\Resources\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class FlightPlansForServiceOrderResource extends JsonResource
{

    function __construct(LengthAwarePaginator $data, string|null $service_order_id)
    {
        $this->data = $data;
        $this->service_order_id = $service_order_id;
        $this->formatedData = [];
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
                "image_url" => Storage::url($flight_plan->image->path),
                "created_at" => date("Y-m-d", strtotime($flight_plan->created_at)),
                "name" => $flight_plan->name,
                "file" => $flight_plan->file,
                "total_incidents" => null,
                "total_service_orders" => $flight_plan->service_orders->count(),
                "selected" => 0
            ];

            // All flight plan related service orders
            $total_incidents_counter = 0;
            foreach ($flight_plan->service_orders as $service_order) {

                // Incidents counter
                if (!is_null($service_order->pivot->incidents)) {
                    $actual_flight_plan_incidents_in_service_order = $service_order->pivot->incidents->count();
                    $total_incidents_counter += $actual_flight_plan_incidents_in_service_order;
                }

                // Check if is related to actual service order - in service order updated will appear as a selected flight plan or not 
                $this->formatedData["records"][$flight_plan_row]["selected"] = (int) intval($service_order->id) == intval($this->service_order_id);
            }

            $this->formatedData["records"][$flight_plan_row]["total_incidents"] = $total_incidents_counter;
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
