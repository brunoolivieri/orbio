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
        foreach ($this->data as $row => $flight_plan) {

            $this->formatedData["records"][$row] = [
                "id" => $flight_plan->id,
                "creator" => [
                    "name" => $flight_plan->user->name,
                    "email" => $flight_plan->user->email,
                    "deleted_at" => $flight_plan->user->deleted_at
                ],
                "name" => $flight_plan->name,
                "service_orders" => $flight_plan->service_orders,
                "logs" => $flight_plan->logs,
                "incidents" => $flight_plan->incidents,
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

            if (!empty($flight_plan->log)) {
                $this->formatedData["records"][$row]["log"] = [
                    "id" => $flight_plan->log->id,
                    "report" => $flight_plan->log->report,
                    "logname" => $flight_plan->log->logname,
                    "observation" => $flight_plan->log->observation,
                    "created_at" => date('d-m-Y h:i', strtotime($flight_plan->log->created_at))
                ];
            }

            if (!empty($flight_plan->incident_id)) {
                $this->formatedData["records"][$row]["incident"] = [
                    "id" => $flight_plan->incident->id,
                    "type" => $flight_plan->incident->type,
                    "date" => date('d-m-Y h:i', strtotime($flight_plan->incident->date)),
                    "created_at" => date('d-m-Y h:i', strtotime($flight_plan->incident->created_at))
                ];
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
