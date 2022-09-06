<?php

namespace App\Models\FlightPlans;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlightPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "flight_plans";
    protected $guarded = [];

    /*
    * Scope for search
    */
    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {

            if (is_numeric($value_searched)) {
                $query->where('id', $value_searched);
            } else {
                $query->where('name', 'LIKE', '%' . $value_searched . '%');
            }
        });
    }

    /*
    * Scope for filter
    */
    function scopeFilter($query, $filters)
    {
        return $query->when((bool) $filters, function ($query) use ($filters) {

            foreach ($filters as $index => $filter) {
                $query->where($filter["column"], $filter["value"]);
            }
        });
    }

    /*
    * Relationship one to one with incidents table
    */
    function incident()
    {

        return $this->belongsTo("App\Models\Incidents\Incident", "incident_id");
    }

    /*
    * Relationship one to one with reports table
    */
    function report()
    {

        return $this->belongsTo("App\Models\Reports\Report", "report_id");
    }

    /*
    * Relationship one to many with service orders table
    */
    function service_orders()
    {

        return $this->hasMany("App\Models\Pivot\ServiceOrderHasFlightPlanModel", "flight_plan_id");
    }
}
