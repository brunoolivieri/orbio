<?php

namespace App\Models\Incidents;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncidentModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "incidents";
    protected $guarded = [];
    
}
