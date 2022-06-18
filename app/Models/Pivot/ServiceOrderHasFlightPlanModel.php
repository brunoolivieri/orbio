<?php

namespace App\Models\Pivot;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOrderHasFlightPlanModel extends Model
{
    use HasFactory;

    protected $table = "service_order_has_flight_plan";
    public $timestamps = false;
    protected $guarded = [];

    function flight_plans(){
        return $this->belongsTo("App\Models\FlightPlans\FlightPlanModel", "flight_plan_id");
    }
}
