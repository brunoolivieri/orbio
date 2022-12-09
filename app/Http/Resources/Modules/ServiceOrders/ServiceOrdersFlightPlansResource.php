<?php

namespace App\Http\Resources\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

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

            $total_incidents = 0;
            $total_service_orders = $flight_plan->service_orders->count();

            $this->formatedData["records"][$flight_plan_row] = [
                "id" => $flight_plan->id,
                "image_url" => Storage::url($flight_plan->image->path),
                "creator" => [
                    "name" => $flight_plan->user->name,
                    "email" => $flight_plan->user->email,
                    "deleted_at" => $flight_plan->user->deleted_at
                ],
                "created_at" => date("Y-m-d", strtotime($flight_plan->created_at)),
                "name" => $flight_plan->name,
                "file" => $flight_plan->file,
                "total_incidents" => $total_incidents,
                "total_service_orders" => $total_service_orders
            ];

            if (!empty($flight_plan->logs)) {
                foreach ($flight_plan->logs as $log_row => $log) {

                    $this->formatedData["records"][$flight_plan_row]["logs"][$log_row] = [
                        "id" => $log->id,
                        "name" => $log->name,
                        "path" => $log->path,
                        "timestamp" => date('Y-m-d', strtotime($log->timestamp)),
                        "created_at" => $log->created_at,
                        "deleted_at" => $log->deleted_at
                    ];
                }
            }

            // Related service orders
            foreach ($flight_plan->service_orders as $service_order) {
                $this->formatedData["records"][$flight_plan_row]["selected"] = intval($service_order->id) == intval($this->service_order_id) ? 1 : 0;
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
