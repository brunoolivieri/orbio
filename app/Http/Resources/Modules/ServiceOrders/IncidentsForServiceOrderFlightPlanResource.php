<?php

namespace App\Http\Resources\Modules\ServiceOrders;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class IncidentsForServiceOrderFlightPlanResource extends JsonResource
{
    function __construct(LengthAwarePaginator $data, int $serviceOrderId, int $flightPlanId)
    {
        $this->serviceOrderId = $serviceOrderId;
        $this->flightPlanId = $flightPlanId;
        $this->data = $data;
        $this->formatedData = [];
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
