<?php

namespace App\Models\Drones;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DroneModel extends Model
{
    use HasFactory;

    public $table = "drones";
    protected $guarded = [];

}
