<?php

namespace App\Http\Resources\Modules\FlightPlans;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class FlightPlansLogPanelResource extends JsonResource
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

        foreach ($this->data as $row => $log) {

            $this->formatedData["records"][$row] = [
                "id" => $log->id,
                "flight_plan" => $log->flight_plan,
                "name" => $log->name,
                "filename" => $log->filename,
                "path" => $log->path,
                "timestamp" => date('d-m-Y h:i', strtotime($log->timestamp)),
                "created_at" => $log->created_at,
                "updated_at" => $log->updated_at,
                "deleted_at" => $log->deleted_at
            ];
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
