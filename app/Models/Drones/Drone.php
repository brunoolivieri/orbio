<?php

namespace App\Models\Drones;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\FlightPlans\FlightPlan;
use App\Models\ServiceOrders\ServiceOrder;

class Drone extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    function scopeSearch($query, $value_searched)
    {
        return $query->when($value_searched, function ($query, $value_searched) {

            $query->when(is_numeric($value_searched), function ($query) use ($value_searched) {

                $query->where('id', $value_searched)
                    ->orWhere('weight', $value_searched);
            }, function ($query) use ($value_searched) {

                $query->where('name', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('manufacturer', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('model', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('record_number', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('serial_number', 'LIKE', '%' . $value_searched . '%');
            });
        });
    }

    function scopeFilter($query, $filters)
    {
        return $query->when((bool) $filters, function ($query) use ($filters) {

            foreach ($filters as $index => $filter) {
                $query->where($filter["column"], $filter["value"]);
            }
        });
    }

    function service_orders()
    {
        return $this->belongsToMany(ServiceOrder::class, "service_order_flight_plan", "drone_id")->withPivot(["id", "battery_id", "equipment_id"]);
    }

    function flight_plans()
    {
        return $this->belongsToMany(FlightPlan::class, "service_order_flight_plan", "drone_id")->withPivot(["id", "drone_id", "battery_id"]);
    }

    protected $casts = [
        'created_at' => 'date:Y-m-d',
        'updated_at' => 'date:Y-m-d'
    ];
}
