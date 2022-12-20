<?php

namespace App\Models\Pivot;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// Models
use App\Models\FlightPlans\FlightPlan;
use App\Models\ServiceOrders\ServiceOrder;
use App\Models\Incidents\Incident;
use App\Models\Logs\Log;

class ServiceOrderFlightPlan extends Model
{
    use HasFactory;

    public $table = "service_order_flight_plan";

    function flight_plan()
    {
        return $this->belongsTo(FlightPlan::class, "flight_plan_id", "id")->withTrashed();
    }

    function service_order()
    {
        return $this->belongsTo(ServiceOrder::class, "service_order_id", "id")->withTrashed();
    }

    function incidents()
    {
        return $this->hasMany(Incident::class, "service_order_flight_plan_id")->withTrashed();
    }

    function logs()
    {
        return $this->hasMany(Log::class, "service_order_flight_plan_id")->withTrashed();
    }
}
