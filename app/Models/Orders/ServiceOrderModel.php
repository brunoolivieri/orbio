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

    function has_users(){
        return $this->hasOne("App\Models\Pivot\ServiceOrderHasUserModel", "service_order_id");
    }

    /*
    * Relationship with service_order_has_flight_plan table
    */
    function has_flight_plans(){

        return $this->hasMany("App\Models\Pivot\ServiceOrderHasFlightPlanModel", "service_order_id");

    }
}
