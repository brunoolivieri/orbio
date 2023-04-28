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

    public function toArray($request)
    {
        foreach ($this->data as $flight_plan_row => $flight_plan) {

            $this->formatedData["records"][$flight_plan_row] = [
                "id" => $flight_plan->id,
                "image_url" => Storage::url($flight_plan->image_path),
                "csv_path" => Storage::url($flight_plan->csv_path),
                "type" => $flight_plan->type,
                "creator" => [
                    "name" => $flight_plan->user->name,
                    "email" => $flight_plan->user->email,
                    "deleted_at" => $flight_plan->user->deleted_at
                ],
                "name" => $flight_plan->name,
                "files" => json_decode($flight_plan->files),
                "localization" => [
                    "coordinates" => $flight_plan->coordinates,
                    "state" => $flight_plan->state,
                    "city" => $flight_plan->city
                ],
                "description" => $flight_plan->description,
                "created_at" => date("Y-m-d", strtotime($flight_plan->created_at)),
                "updated_at" => date("Y-m-d", strtotime($flight_plan->updated_at)),
                "deleted_at" => $flight_plan->deleted_at
            ];

            if ($flight_plan->trashed()) {
                $this->formatedData["records"][$flight_plan_row]["status_badge"] = [
                    "label" => "Deletado",
                    "color" => "error"
                ];
            } else {
                $this->formatedData["records"][$flight_plan_row]["status_badge"] = [
                    "label" => "Ativo",
                    "color" => "success"
                ];
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
