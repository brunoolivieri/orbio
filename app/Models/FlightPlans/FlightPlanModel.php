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
    * Relationship with incidents table
    */
    function incidents()
    {

        return $this->belongsTo("App\Models\Incidents\IncidentModel", "incident_id");
    }

    /*
    * Relationship with reports table
    */
    function reports()
    {

        return $this->belongsTo("App\Models\Reports\ReportModel", "report_id");
    }

    /*
    * Relationship with service_order_has_flight_plan table
    */
    function has_service_order()
    {

        return $this->hasMany("App\Models\Pivot\ServiceOrderHasFlightPlanModel", "flight_plan_id");
    }
}
