<?php

namespace App\Http\Resources\v1\Modules\FlightPlans;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class FlightPlansPaginationResource extends JsonResource
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
                "folder" => $flight_plan->folder,
                "csv_path" => null,
                "creator" => [
                    "name" => $flight_plan->user->name,
                    "email" => $flight_plan->user->email,
                    "deleted_at" => $flight_plan->user->deleted_at
                ],
                "name" => $flight_plan->name,
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

            if ($flight_plan->trashed()) {
                $this->formatedData["records"][$flight_plan_row]["status_badge"] = [
                    "label" => "Desabilitado",
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
