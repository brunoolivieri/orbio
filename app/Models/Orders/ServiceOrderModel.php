<?php

namespace App\Models\Orders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceOrderModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "service_orders";
    protected $guarded = [];

    /*
    * Relationship with flight_plans table
    */
    function flight_plans(){

        return $this->belongsTo("App\Models\Plans\FlightPlanModel", "flight_plan_id");

    }

    /*
    * Relationship with service_order_has_user table
    */
    function service_order_has_user(){

        return $this->hasOne("App\Models\Orders\ServiceOrderHasUserModel", "service_order_id");

    }

    /*
    * Relationship with service_order_has_flight_plan table
    */
    function service_order_has_flight_plan(){

        return $this->hasMany("App\Models\Orders\ServiceOrderHasFlightPlansModel", "service_order_id");

    }
}
