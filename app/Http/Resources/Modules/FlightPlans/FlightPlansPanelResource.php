<?php

namespace App\Http\Resources\Modules\FlightPlans;

use Illuminate\Http\Resources\Json\JsonResource;

class FlightPlansPanelResource extends JsonResource
{
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
