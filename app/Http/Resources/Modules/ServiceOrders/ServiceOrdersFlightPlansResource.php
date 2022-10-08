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
        foreach ($this->data as $flight_plan_row => $flight_plan) {

            $this->formatedData["records"][$flight_plan_row] = [
                "id" => $flight_plan->id,
                "creator" => [
                    "name" => $flight_plan->user->name,
                    "email" => $flight_plan->user->email,
                    "deleted_at" => $flight_plan->user->deleted_at
                ],
                "name" => $flight_plan->name,
                "file" => $flight_plan->file,
                "incident" => 0
            ];

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

            // Related service orders
            foreach ($flight_plan->service_orders as $service_order) {

                $this->formatedData["records"][$flight_plan_row]["selected"] = intval($service_order->id) === intval($this->service_order_id) ? 1 : 0;
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
