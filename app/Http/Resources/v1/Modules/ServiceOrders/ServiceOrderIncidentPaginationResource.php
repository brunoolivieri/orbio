<?php

namespace App\Http\Resources\v1\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class ServiceOrderIncidentPaginationResource extends JsonResource
{
    function __construct(LengthAwarePaginator $data)
    {
        $this->data = $data;
        $this->formatedData = [];
    }

    public function toArray($request)
    {
        foreach ($this->data as $row => $incident) {

            $this->formatedData["records"][$row] = [
                "id" => $incident->id,
                "type" => $incident->type,
                "description" => $incident->description,
                "date" => date('Y-m-d', strtotime($incident->date)),
                "created_at" => date('Y-m-d', strtotime($incident->created_at)),
                "updated_at" => empty($incident->updated_at) ? "N/A" : date('Y-m-d', strtotime($incident->updated_at)),
                "service_order" => null
            ];
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
