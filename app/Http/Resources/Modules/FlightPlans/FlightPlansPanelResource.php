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

            $flight_plan_files = json_decode($flight_plan->files);

            $this->formatedData["records"][$flight_plan_row] = [
                "id" => $flight_plan->id,
                "image_url" => Storage::url($flight_plan->image_path),
                "csv_path" => null,
                "type" => $flight_plan->type,
                "creator" => [
                    "name" => $flight_plan->user->name,
                    "email" => $flight_plan->user->email,
                    "deleted_at" => $flight_plan->user->deleted_at
                ],
                "name" => $flight_plan->name,
                "files" => $flight_plan_files,
                "localization" => [
                    "coordinates" => $flight_plan->coordinates,
                    "state" => $flight_plan->state,
                    "city" => $flight_plan->city
                ],
                "description" => $flight_plan->description,
                "created_at" => date("Y-m-d", strtotime($flight_plan->created_at)),
                "updated_at" => date("Y-m-d", strtotime($flight_plan->updated_at)),
                "deleted_at" => $flight_plan->deleted_at,
                "is_route_editable" => true
            ];

            $flight_plan_timestamp = explode("/", $flight_plan_files[0])[1];
            $this->formatedData["records"][$flight_plan_row]["csv_path"] = "flight_plans/$flight_plan_timestamp/single/$flight_plan_timestamp.txt";

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

            if ($flight_plan->service_orders) {
                foreach ($flight_plan->service_orders as $service_order) {
                    if ($service_order->status) {
                        $this->formatedData["records"][$flight_plan_row]["is_route_editable"] = false;
                    }
                }
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
