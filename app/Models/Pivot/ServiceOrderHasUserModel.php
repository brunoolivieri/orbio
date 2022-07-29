<?php

namespace App\Models\Pivot;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOrderHasUserModel extends Model
{
    use HasFactory;

    protected $table = "service_order_has_user";
    public $timestamps = false;
    protected $guarded = [];

    function has_creator(){
        return $this->belongsTo("App\Models\User\UserModel", "creator_id");
    }

    function has_pilot(){
        return $this->belongsTo("App\Models\User\UserModel", "pilot_id");
    }

    function has_client(){
        return $this->belongsTo("App\Models\User\UserModel", "client_id");
    }

    function service_order(){
        return $this->belongsTo("App\Models\Orders\ServiceOrderModel", "service_order_id");
    }
}
