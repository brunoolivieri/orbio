<?php

namespace App\Http\Resources\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Incidents\Incident;

class ServiceOrdersPanelResource extends JsonResource
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
        foreach ($this->data as $row => $service_order) {

            $this->formatedData["records"][$row] = [
                "id" => $service_order->id,
                "number" => $service_order->number,
                "start_date" => $service_order->start_date,
                "end_date" => $service_order->end_date,
                "status" => $service_order->status,
                "flight_plans" => [],
                "incidents" => 0,
                "observation" => $service_order->observation,
                "created_at" => strtotime($service_order->created_at),
                "updated_at" => empty($service_order->updated_at) ? "N/A" : strtotime($service_order->updated_at)
            ];

            // ============================== RELATED FLIGHT PLANS WITH INCIDENTS ============================== //

            // Related flight plans
            foreach ($service_order->flight_plans as $index => $flight_plan) {

                $incidents = Incident::where("service_order_flight_plan_id", $flight_plan->pivot->id)->get();

                $this->formatedData["records"][$row]["flight_plans"][$index] = [
                    "id" => $flight_plan->id,
                    "file" => $flight_plan->file,
                    "incidents" => $incidents,
                    "deleted" => is_null($flight_plan->deleted_at) ? 0 : 1
                ];

                if($incidents->count() > 0){
                    $this->formatedData["records"][$row]["incidents"] += $incidents->count();
                }
            }

            // ============================== RELATED USERS ============================== //

            // Get creator, pilot and client 
            foreach ($service_order->users as $index => $user) {

                $this->formatedData["records"][$row]["users"][$user->pivot->role] = [
                    "id" => $user->id,
                    "profile_id" => $user->profile_id,
                    "name" => $user->name,
                    "status" => $user->status,
                    "deleted" => is_null($user->deleted_at) ? 0 : 1
                ];
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
