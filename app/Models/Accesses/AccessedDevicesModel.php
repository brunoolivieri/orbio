<?php

namespace App\Models\Accesses;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessedDevicesModel extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $table = "accessed_devices";

    /*
    * Scope for increment device access
    */
    function scopeIncrementDeviceAccess($query)
    {
        return $query->increment("personal_computer", 1);
    }
}
