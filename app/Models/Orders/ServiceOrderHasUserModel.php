<?php

namespace App\Models\Orders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOrderHasUserModel extends Model
{
    use HasFactory;

    protected $table = "service_order_has_user";
    public $timestamps = false;
    protected $guarded = [];

    function users(){
        return $this->belongsTo("App\Models\User\UserModel", "id_usuario");
    }

    function service_order(){
        return $this->belongsTo("App\Models\Orders\ServiceOrdersModel", "id_ordem_servico");
    }

}
