<?php

namespace App\Http\Resources\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use App\Models\Logs\Log;

class LogsForServiceOrderFlightPlansResource extends JsonResource
{
    function __construct(LengthAwarePaginator $data, int $serviceOrderId, int $flightPlanId)
    {
        $this->serviceOrderId = $serviceOrderId;
        $this->flightPlanId = $flightPlanId;
        $this->data = $data;
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
        $index_counter = 0;
        foreach ($this->data as $log) {

            $is_selectable = true;
            $selected = false;
            $to_render = true;
            $total_rendered = 0;

            // If log is already related to a service order flight plan
            if (!is_null($log->service_order_flight_plan)) {

                // Can be a different flight plan in the actual service order - render it but turn unselectable 
                // Can be the actual flight plan in the actual service order - render and turn selectable 
                // Can be the actual flight plan in a different service order - not render
                // Can be a different flight plan of a different service order - not render

                // Is the same service order?
                if ($log->service_order_flight_plan->service_order_id == $this->serviceOrderId) {
                    // Is the same flight plan?
                    if ($log->service_order_flight_plan->flight_plan_id == $this->flightPlanId) {
                        $selected = true;
                    } else if ($log->service_order_flight_plan->flight_plan_id != $this->flightPlanId) {
                        $is_selectable = false;
                    }
                } else {
                    $to_render = false;
                }
            }

            if ($to_render) {
                $this->formatedData["records"][$index_counter] = [
                    "id" => $log->id,
                    "name" => $log->name,
                    "image_url" => Storage::url($log->image->path),
                    "filename" => $log->filename,
                    "path" => $log->path,
                    "timestamp" => date('d-m-Y h:i', strtotime($log->timestamp)),
                    "created_at" => $log->created_at,
                    "is_selectable" => $is_selectable,
                    "selected" => $selected
                ];

                $total_rendered += 1;
            }

            $index_counter++;
        }

        $this->formatedData["total_records"] += $total_rendered;
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
