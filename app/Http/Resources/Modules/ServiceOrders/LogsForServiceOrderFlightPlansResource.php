<?php

namespace App\Http\Resources\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use App\Models\Logs\Log;

class LogsForServiceOrderFlightPlansResource extends JsonResource
{
    function __construct(LengthAwarePaginator $data)
    {
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
        foreach ($this->data as $log_row => $log) {

            $this->formatedData["records"][$log_row] = [
                "id" => $log->id,
                "name" => $log->name,
                "image_url" => Storage::url($log->image->path),
                "filename" => $log->filename,
                "path" => $log->path,
                "timestamp" => date('d-m-Y h:i', strtotime($log->timestamp)),
                "created_at" => $log->created_at,
                "is_available" => true
            ];

            // An already selected log in a finished service order is not available

            if (!is_null($log->service_order_flight_plan)) {

                if (Log::where("service_order_flight_plan_id", $log->service_order_flight_plan->id)->exists()) {
                    $this->formatedData["records"][$log_row]["is_available"] = false;
                }
            }
        }

        return $this->formatedData;
    }
}
