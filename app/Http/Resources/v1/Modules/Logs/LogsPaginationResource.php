<?php

namespace App\Http\Resources\v1\Modules\Logs;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class LogsPaginationResource extends JsonResource
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
                "service_order" => [
                    "number" => "Sem vínculo"
                ],
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

            // Get related service order
            if (!is_null($log->service_order_flight_plan)) {
                // Get related service order // Table "service_order_flight_plan"
                $service_order = $log->service_order_flight_plan->service_order;
                $this->formatedData["records"][$service_order_row]["service_order"] = [
                    "number" => $service_order->number
                ];
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
