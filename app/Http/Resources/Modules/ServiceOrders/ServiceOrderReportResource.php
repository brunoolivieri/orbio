<?php

namespace App\Http\Resources\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Incidents\Incident;
use App\Models\Logs\Log;
use Illuminate\Support\Facades\Storage;

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

        foreach ($this->data as $service_order_index => $service_order) {

            $this->formatedData["records"][$service_order_index] = [
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
            foreach ($service_order->users as $user) {

                $this->formatedData["records"][$service_order_index]["users"][$user->pivot->role] = [
                    "id" => $user->id,
                    "profile_id" => $user->profile_id,
                    "name" => $user->name,
                    "status" => $user->status,
                    "deleted" => is_null($user->deleted_at) ? 0 : 1
                ];
            }

            // ============================== RELATED FLIGHT PLANS WITH INCIDENTS ============================== //

            $log_per_flight_plan = [];
            foreach ($service_order->flight_plans as $flight_plan_index => $flight_plan) {

                // Initial flight plan data 
                $this->formatedData["records"][$service_order_index]["flight_plans"][$flight_plan_index] = [
                    "id" => $flight_plan->id,
                    "image_url" => Storage::url($flight_plan->image->path),
                    "file" => $flight_plan->file,
                    "name" => $flight_plan->name,
                    "log" => null,
                    "localization" => [
                        "coordinates" => $flight_plan->coordinates,
                        "city" => $flight_plan->city,
                        "state" =>  $flight_plan->state
                    ],
                    "incidents" => null,
                    "deleted" => is_null($flight_plan->deleted_at) ? 0 : 1
                ];

                // Pivot - Equipments
                $this->formatedData["records"][$service_order_index]["flight_plans"][$flight_plan_index]["battery_id"] = $flight_plan->pivot->battery_id;
                $this->formatedData["records"][$service_order_index]["flight_plans"][$flight_plan_index]["equipment_id"] = $flight_plan->pivot->equipment_id;
                $this->formatedData["records"][$service_order_index]["flight_plans"][$flight_plan_index]["drone_id"] = $flight_plan->pivot->drone_id;

                // Pivot - Incidents
                $incidents = Incident::where("service_order_flight_plan_id", $flight_plan->pivot->id)->get();
                $this->formatedData["records"][$service_order_index]["flight_plans"][$flight_plan_index]["incidents"] = $incidents;
                $total_incidents = $incidents->count();

                // Pivot - log
                $log_check = 0;
                $log = Log::where("service_order_flight_plan_id", $flight_plan->pivot->id)->first();
                if ($log) {

                    $this->formatedData["records"][$service_order_index]["flight_plans"][$flight_plan_index]["log"] = [
                        "id" => $log->id,
                        "image_url" => Storage::url($log->image->path),
                        "timestamp" => $log->timestamp,
                        "filename" => $log->filename
                    ];

                    $log_check = 1;
                }

                $this->formatedData["records"][$service_order_index]["total_incidents"] += $total_incidents;
                $log_per_flight_plan[$flight_plan_index] = $log_check;
                
            }

            // A service order need to have log for each flight plan and no report
            if (in_array(0, $log_per_flight_plan) || !is_null($service_order->report_id)) {
                $this->formatedData["records"][$service_order_index]["available"] = false;
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
