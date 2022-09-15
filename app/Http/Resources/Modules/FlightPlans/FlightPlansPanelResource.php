<?php

namespace App\Http\Resources\Modules\FlightPlans;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

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
                "name" => $flight_plan->name,
                "report_id" => $flight_plan->report_id,
                "incident_id" => $flight_plan->incident_id,
                "coordinates_file" => $flight_plan->coordinates_file,
                "description" => $flight_plan->description,
                "created_at" => date('d-m-Y h:i', strtotime($flight_plan->created_at)),
                "updated_at" => empty($flight_plan->updated_at) ? "N/A" : date('d-m-Y h:i', strtotime($flight_plan->updated_at))
            ];

            if (!empty($flight_plan->report_id)) {
                $this->formatedData["records"][$row]["report"] = [
                    "id" => $flight_plan->report->id,
                    "start_date" => $flight_plan->report->start_date,
                    "end_date" => $flight_plan->report->end_date,
                    "flight_log" => $flight_plan->report->flight_log,
                    "observation" => $flight_plan->report->observation,
                    "created_at" => date('d-m-Y h:i', strtotime($flight_plan->report->created_at))
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
