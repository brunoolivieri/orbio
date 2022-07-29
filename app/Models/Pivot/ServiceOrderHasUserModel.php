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

    function users(string $field){
        return $this->belongsTo("App\Models\User\UserModel", $field);
    }

    function service_order(){
        return $this->belongsTo("App\Models\Orders\ServiceOrderModel", "service_order_id");
    }
}
