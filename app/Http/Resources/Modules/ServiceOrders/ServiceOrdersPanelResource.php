<?php

namespace App\Http\Resources\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class ServiceOrdersPanelResource extends JsonResource
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

        foreach($this->data as $row => $service_order){

            $formated_data["records"][$row] = [
                "id" => $service_order->id,
                "numOS" => $service_order->numOS,
                "start_date" => $service_order->start_date,
                "end_date" => $service_order->end_date,
                "status" => $service_order->status,
                "observation" => $service_order->observation,
                "created_at" => date( 'd-m-Y h:i', strtotime($service_order->created_at)),
                "updated_at" => empty($service_order->updated_at) ? "N/A" : date( 'd-m-Y h:i', strtotime($service_order->updated_at))
            ];

            // ============================== RELATED FLIGHT PLANS ====== //
            if($service_order->has_flight_plans->count() > 0){
                foreach($service_order->has_flight_plans as $index => $pivot_record){

                    $formated_data["records"][$row]["flight_plans"][$index]["id"] = $pivot_record->flight_plan->id;
                    $formated_data["records"][$row]["flight_plans"][$index]["file"] = $pivot_record->flight_plan->coordinates_file;
                    $formated_data["records"][$row]["flight_plans"][$index]["status"] = $pivot_record->flight_plan->status;
    
                }
            }else{
                $formated_data["records"][$row]["flight_plans"] = array();
            }
            
            // ============================== RELATED USERS ====== //

            // Related creator
            if($service_order->has_users->has_creator->count() > 0){

                $formated_data["records"][$row]["creator"]["id"] = $service_order->has_users->has_creator->id;
                $formated_data["records"][$row]["creator"]["profile_id"] = $service_order->has_users->has_creator->profile_id;
                $formated_data["records"][$row]["creator"]["name"] = $service_order->has_users->has_creator->name;
                $formated_data["records"][$row]["creator"]["status"] = $service_order->has_users->has_creator->status;

            }else{
                $formated_data["records"][$row]["creator"]["id"] = 0;
            }

            // Related pilot
            if($service_order->has_users->has_pilot->count() > 0){

                $formated_data["records"][$row]["pilot"]["id"] = $service_order->has_users->has_pilot->id;
                $formated_data["records"][$row]["pilot"]["profile_id"] = $service_order->has_users->has_pilot->profile_id;
                $formated_data["records"][$row]["pilot"]["name"] = $service_order->has_users->has_pilot->name;
                $formated_data["records"][$row]["pilot"]["status"] = $service_order->has_users->has_pilot->status;

            }else{
                $formated_data["records"][$row]["pilot"]["id"] = 0;
            }

            // Related client
            if($service_order->has_users->has_client->count() > 0){

                $formated_data["records"][$row]["client"]["id"] = $service_order->has_users->has_client->id;
                $formated_data["records"][$row]["client"]["profile_id"] = $service_order->has_users->has_client->profile_id;
                $formated_data["records"][$row]["client"]["name"] = $service_order->has_users->has_client->name;
                $formated_data["records"][$row]["client"]["status"] = $service_order->has_users->has_client->status;

            }else{
                $formated_data["records"][$row]["client"]["id"] = 0;
            }

            $formated_data["total_records"] = $this->data->total();
            $formated_data["records_per_page"] = $this->data->perPage();
            $formated_data["total_pages"] = $this->data->lastPage();

            return $formated_data;

        }

    }
}
