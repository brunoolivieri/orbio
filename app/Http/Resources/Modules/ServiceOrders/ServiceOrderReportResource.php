<?php

namespace App\Http\Resources\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Incidents\Incident;
use App\Models\Logs\Log;

class ServiceOrderReportResource extends JsonResource
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
                "status" => $service_order->status,
                "number" => $service_order->number,
                "start_date" => $service_order->start_date,
                "end_date" => $service_order->end_date,
                "total_flight_plans" => $service_order->flight_plans->count(),
                "total_incidents" => 0,
                "total_logs" => 0,
                "observation" => $service_order->observation,
                "available" => true
            ];

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

            // ============================== RELATED FLIGHT PLANS WITH INCIDENTS ============================== //

            $check_if_all_plans_has_log = [];
            foreach ($service_order->flight_plans as $index => $flight_plan) {

                $incidents = Incident::where("service_order_flight_plan_id", $flight_plan->pivot->id)->get();
                $logs = Log::where("service_order_flight_plan_id", $flight_plan->pivot->id)->get();

                $this->formatedData["records"][$row]["flight_plans"][$index] = [
                    "id" => $flight_plan->id,
                    "file" => $flight_plan->file,
                    "name" => $flight_plan->name,
                    "logs" => $logs,
                    "localization" => [
                        "coordinates" => $flight_plan->coordinates,
                        "city" => $flight_plan->city,
                        "state" =>  $flight_plan->state
                    ],
                    "drone_id" => $flight_plan->pivot->drone_id,
                    "battery_id" => $flight_plan->pivot->battery_id,
                    "equipment_id" => $flight_plan->pivot->equipment_id,
                    "incidents" => $incidents,
                    "deleted" => is_null($flight_plan->deleted_at) ? 0 : 1
                ];

                $total_incidents = $incidents->count();
                $total_logs = $logs->count();

                $this->formatedData["records"][$row]["total_incidents"] += $total_incidents;
                $this->formatedData["records"][$row]["total_logs"] += $total_logs;

                if ($total_logs > 0) {
                    $check_if_all_plans_has_log[$index] = 1;
                } else {
                    $check_if_all_plans_has_log[$index] = 0;
                }

                // An available service order need to have logs for all flight plans
                if (in_array(0, $check_if_all_plans_has_log) || !is_null($service_order->report_id)) {
                    $this->formatedData["records"][$row]["available"] = false;
                }
            }

            $this->formatedData["total_records"] = $this->data->total();
            $this->formatedData["records_per_page"] = $this->data->perPage();
            $this->formatedData["total_pages"] = $this->data->lastPage();

            return $this->formatedData;
        }
    }
}
