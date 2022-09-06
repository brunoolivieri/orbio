<?php

namespace App\Models\Accesses;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnualTraffic extends Model
{
    use HasFactory;

    protected $fillable = ['*'];
    public $table = "annual_traffic";
}
