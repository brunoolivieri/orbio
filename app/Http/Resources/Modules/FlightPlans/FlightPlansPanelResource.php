<?php

namespace App\Http\Resources\Modules\FlightPlans;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

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
                "service_orders" => $flight_plan->service_orders,
                "logs" => $flight_plan->logs,
                "incidents" => [], //$flight_plan->pivot->incident_id
                "file" => $flight_plan->file,
                "localization" => [
                    "coordinates" => $flight_plan->coordinates,
                    "state" => $flight_plan->state,
                    "city" => $flight_plan->city
                ],
                "description" => $flight_plan->description,
                "created_at" => date('d-m-Y h:i', strtotime($flight_plan->created_at)),
                "updated_at" => empty($flight_plan->updated_at) ? "N/A" : date('d-m-Y h:i', strtotime($flight_plan->updated_at))
            ];

            if (!empty($flight_plan->logs)) {

                foreach ($flight_plan->logs as $log_row => $log) {

                    $this->formatedData["records"][$flight_plan_row]["log"][$log_row] = [
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
