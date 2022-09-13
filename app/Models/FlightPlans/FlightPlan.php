<?php

namespace App\Models\FlightPlans;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
// Model
use App\Models\Incidents\Incident;
use App\Models\Reports\Report;
use App\Models\ServiceOrders\ServiceOrder;

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
        return $this->belongsTo(Incident::class, "incident_id");
    }

    /*
    * Relationship one to one with reports table
    */
    function report()
    {
        return $this->belongsTo(Report::class, "report_id");
    }

    /*
    * Relationship many to many with service orders table
    */
    function service_orders()
    {
        return $this->belongsToMany(ServiceOrder::class, "service_order_flight_plan");
    }
}
