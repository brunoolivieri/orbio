<?php

namespace App\Models\Reports;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
// Models
use App\Models\FlightPlans\FlightPlan;

class Report extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "reports";
    protected $fillable = ['*'];

    /*
    * Relationship many to one with flight plans table
    */
    function flight_plan()
    {
        return $this->hasOne(FlightPlan::class, "report_id");
    }
}
