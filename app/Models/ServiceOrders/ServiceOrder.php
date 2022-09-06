<?php

namespace App\Models\ServiceOrders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceOrder extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    /*
    * Scope for search
    */
    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {

            if (is_numeric($value_searched)) {
                $query->where('id', $value_searched);
            }
        });
    }

    /*
    * Scope for filter
    */
    function scopeFilter($query, $filters)
    {
        return $query->when((bool) $filters, function ($query) use ($filters) {

            foreach ($filters as $filter) {
                $query->where($filter["column"], $filter["value"]);
            }
        });
    }

    function users()
    {
        return $this->hasOne("App\Models\Pivot\ServiceOrderHasUserModel", "service_order_id");
    }

    /*
    * Relationship with service_order_has_flight_plan table
    */
    function flight_plans()
    {

        return $this->hasMany("App\Models\Pivot\ServiceOrderHasFlightPlanModel", "service_order_id");
    }
}
