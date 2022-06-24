<?php

namespace App\Models\Batteries;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class BatteryModel extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $table = "batteries";

}
