<?php

namespace App\Http\Resources\Modules\Administration;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class UsersResourcePagination extends JsonResource
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

        foreach($this->data as $row => $record){

            $formated_data["records"][$row] = [
                "id" => $record->id,
                "name" => $record->name,
                "profile_id" => $record->profile->id,
                "profile_name" => $record->profile->name,
                "complementary_data_id" => $record->complementary_data_id,
                "email" => $record->email,
                "last_access" => empty($record->last_access) ? "N/A" : date( 'd-m-Y h:i', strtotime($record->last_access)),
                "created_at" => empty($record->created_at) ? "N/A" : date( 'd-m-Y h:i', strtotime($record->created_at)),
                "updated_at" => empty($record->updated_at) ? "N/A" : date( 'd-m-Y h:i', strtotime($record->updated_at))
            ];   

            if($record->status){
                $formated_data["records"][$row]["status_badge"] = ["Ativo", "success"];
            }else if(!$record->status && empty($record->last_access)){
                $formated_data["records"][$row]["status_badge"] = ["Inativo", "error"];
            }else if(!$record->status && empty($record->last_access)){
                $formated_data["records"][$row]["status_badge"] = ["Desativado", "error"];
            }

        }

        $formated_data["total_records"] = $this->data->total();
        $formated_data["records_per_page"] = $this->data->perPage();
        $formated_data["total_pages"] = $this->data->lastPage();

        return $formated_data;

    }
}
