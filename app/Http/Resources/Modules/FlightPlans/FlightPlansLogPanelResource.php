<?php

namespace App\Http\Resources\Modules\FlightPlans;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class FlightPlansLogPanelResource extends JsonResource
{

    private LengthAwarePaginator $data;
    private array $formatedData = [];

    function __construct(LengthAwarePaginator $data)
    {
        $this->data = $data;
    }

    public function toArray($request)
    {
        foreach ($this->data as $service_order_row => $log) {

            $this->formatedData["records"][$service_order_row] = [
                "id" => $log->id,
                "name" => $log->name,
                "image_url" => Storage::url($log->image_path),
                "service_order" => null,
                "flight_plan" => null,
                "filename" => $log->filename,
                "path" => $log->path,
                "timestamp" => date('d-m-Y h:i', strtotime($log->timestamp)),
                "created_at" => $log->created_at,
                "updated_at" => $log->updated_at,
                "deleted_at" => $log->deleted_at
            ];

            if ($log->trashed()) {
                $this->formatedData["records"][$service_order_row]["status_badge"] = [
                    "label" => "Deletado",
                    "color" => "error"
                ];
            } else {
                $this->formatedData["records"][$service_order_row]["status_badge"] = [
                    "label" => "Ativo",
                    "color" => "success"
                ];
            }

            if (!is_null($log->service_order_flight_plan)) {

                // Get related service order // Table "service_order_flight_plan"
                $service_order = $log->service_order_flight_plan->service_order;
                // Get related flight plan // Table "service_order_flight_plan"
                $flight_plan = $log->service_order_flight_plan->flight_plan;

                $this->formatedData["records"][$service_order_row]["service_order"] = [
                    "id" => $service_order->id,
                    "number" => $service_order->number,
                    "status" => $service_order->status,
                    "created_at" => strtotime($service_order->created_at),
                    "deleted" => is_null($service_order->deleted_at) ? 0 : 1
                ];

                $this->formatedData["records"][$service_order_row]["flight_plan"] = [
                    "id" =>  $flight_plan->id,
                    "path" => $flight_plan->file,
                    "image_url" => Storage::url($flight_plan->image_path),
                    "deleted" => is_null($flight_plan->deleted_at) ? 0 : 1
                ];
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
