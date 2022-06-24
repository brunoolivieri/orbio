<?php

namespace App\Models\Equipments;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class EquipmentModel extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $table = "equipments";
    
}
