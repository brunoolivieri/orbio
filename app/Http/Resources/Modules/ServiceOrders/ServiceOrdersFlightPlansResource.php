<?php

namespace App\Http\Resources\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class ServiceOrdersFlightPlansResource extends JsonResource
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
        foreach ($this->data as $row => $flight_plan) {

            $this->formatedData["records"][$row] = [
                "id" => $flight_plan->id,
                "file" => $flight_plan->coordinates_file,
                "incident" => is_null($flight_plan->incident_id) ? 0 : 1
            ];

            // Related service orders
            foreach ($flight_plan->service_orders as $service_order) {

                $this->formatedData["records"][$row]["selected"] = intval($service_order->id) === intval($this->service_order_id) ? 1 : 0;
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
