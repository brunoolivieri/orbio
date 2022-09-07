<?php

namespace App\Models\Pivot;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOrderUser extends Model
{
    use HasFactory;

    protected $table = "service_order_has_user";
    public $timestamps = false;
    protected $guarded = [];

    function creator()
    {
        return $this->belongsTo("App\Models\Users\User", "creator_id");
    }

    function pilot()
    {
        return $this->belongsTo("App\Models\Users\User", "pilot_id");
    }

    function client()
    {
        return $this->belongsTo("App\Models\Users\User", "client_id");
    }

    function service_order()
    {
        return $this->belongsTo("App\Models\ServiceOrders\ServiceOrder", "service_order_id");
    }
}
