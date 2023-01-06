<?php

namespace App\Models\Logs;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
// Models
use App\Models\Images\Image;
use App\Models\Pivot\ServiceOrderFlightPlan;

class Log extends Model
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
    * Polymorphic relationship with table "images"
    */
    function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    /*
    * Relationship with flight plan
    */
    function service_order_flight_plan()
    {
        return $this->belongsTo(ServiceOrderFlightPlan::class, "service_order_flight_plan_id", "id");
    }
}
