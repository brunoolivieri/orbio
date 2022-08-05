<?php

namespace App\Http\Resources\Modules\FlightPlans;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class FlightPlansPanelResource extends JsonResource
{

    private LengthAwarePaginator $data;

    function __construct(LengthAwarePaginator $data){
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
        $formated_data["records"] = array();

        foreach($this->data as $row => $flight_plan){

            $formated_data["records"][$row] = [
                "id" => $flight_plan->id,
                "name" => $flight_plan->name,
                "report_id" => $flight_plan->report_id,
                "incident_id" => $flight_plan->incident_id,
                "coordinates_file" => $flight_plan->coordinates_file,
                "description" => $flight_plan->description,
                "status" => $flight_plan->status,
                "created_at" => empty($flight_plan->created_at) ? "N/A" : date( 'd-m-Y h:i', strtotime($flight_plan->created_at)),
                "updated_at" => empty($flight_plan->updated_at) ? "N/A" : date( 'd-m-Y h:i', strtotime($flight_plan->updated_at))
            ];

            if(!empty($flight_plan->report_id)){
                $formated_data["records"][$row]["report"] = [
                    "id" => $flight_plan->reports->id,
                    "start_date" => $flight_plan->reports->start_date,
                    "end_date" => $flight_plan->reports->end_date,
                    "flight_log" => $flight_plan->reports->flight_log,
                    "observation" => $flight_plan->reports->observation,
                    "created_at" => date( 'd-m-Y h:i', strtotime($flight_plan->reports->created_at))
                ];
            }

            if(!empty($flight_plan->incident_id)){
                $formated_data["records"][$row]["incident"] = [
                    "id" => $flight_plan->incidents->id,
                    "type" => $flight_plan->incidents->type,
                    "date" => date( 'd-m-Y h:i', strtotime($flight_plan->incidents->date)),
                    "created_at" => date( 'd-m-Y h:i', strtotime($flight_plan->incidents->created_at))
                ];
            }

        }

        $formated_data["total_records"] = $this->data->total();
        $formated_data["records_per_page"] = $this->data->perPage();
        $formated_data["total_pages"] = $this->data->lastPage();

        return $formated_data;
    }
}
