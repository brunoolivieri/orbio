<?php

namespace App\Models\FlightPlans;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlightPlanModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "flight_plans";
    protected $guarded = [];

    /*
    * Relationship with incidents table
    */
    function incidents(){

        return $this->belongsTo("App\Models\Incidents\IncidentModel", "incident_id");

    }

    /*
    * Relationship with reports table
    */
    function reports(){

        return $this->belongsTo("App\Models\Reports\ReportModel", "report_id");

    }

    /*
    * Relationship with service_orders table
    */
    function service_orders(){

        return $this->hasMany("App\Models\Orders\ServiceOrderModel", "flight_plan_id");

    }

    /*
    * Relationship with service_order_has_flight_plan table
    */
    function has_flight_plan(){

        return $this->hasMany("App\Models\Pivot\ServiceOrdersHasFlightPlansModel", "flight_plan_id");

    }
}
