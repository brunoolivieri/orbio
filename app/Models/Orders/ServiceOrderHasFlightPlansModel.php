<?php

namespace App\Models\Orders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOrderHasFlightPlansModel extends Model
{
    use HasFactory;

    protected $table = "service_order_has_flight_plans";
    public $timestamps = false;
    protected $guarded = [];
}
