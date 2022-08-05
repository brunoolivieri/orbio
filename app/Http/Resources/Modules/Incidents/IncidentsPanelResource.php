<?php

namespace App\Http\Resources\Modules\Incidents;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class IncidentsPanelResource extends JsonResource
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

        foreach($this->data as $row => $incident){

            $formated_data["records"][$row] = [
                "id" => $incident->id,
                "type" => $incident->type,
                "description" => $incident->description,
                "date" => empty($incident->date) ? "N/A" : date( 'd-m-Y h:i', strtotime($incident->date)),
                "created_at" => empty($incident->created_at) ? "N/A" : date( 'd-m-Y h:i', strtotime($incident->created_at)),
                "updated_at" => empty($incident->updated_at) ? "N/A" : date( 'd-m-Y h:i', strtotime($incident->updated_at))
            ];

        }

        $formated_data["total_records"] = $this->data->total();
        $formated_data["records_per_page"] = $this->data->perPage();
        $formated_data["total_pages"] = $this->data->lastPage();

        return $formated_data;
    }
}
