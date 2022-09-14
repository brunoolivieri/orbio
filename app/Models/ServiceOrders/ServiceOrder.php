<?php

namespace App\Models\ServiceOrders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
// Models
use App\Models\Users\User;
use App\Models\FlightPlans\FlightPlan;

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

    /*
    * Relationship many to many with users table
    */
    function users()
    {
        return $this->belongsToMany(User::class, "service_order_user")->withPivot('role')->withTrashed();
    }

    /*
    * Relationship many to many with flight plans table
    */
    function flight_plans()
    {
        return $this->belongsToMany(FlightPlan::class, "service_order_flight_plan")->withTrashed();
    }
}
