<?php

namespace App\Models\Orders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceOrderModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "service_orders";
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

            foreach ($filters as $index => $filter) {
                $query->where($filter["column"], $filter["value"]);
            }
        });
    }

    function has_users()
    {
        return $this->hasOne("App\Models\Pivot\ServiceOrderHasUserModel", "service_order_id");
    }

    /*
    * Relationship with service_order_has_flight_plan table
    */
    function has_flight_plans()
    {

        return $this->hasMany("App\Models\Pivot\ServiceOrderHasFlightPlanModel", "service_order_id");
    }
}
