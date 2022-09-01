<?php

namespace App\Models\Accesses;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class AnnualAccessesModel extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $table = "annual_traffic";
}
