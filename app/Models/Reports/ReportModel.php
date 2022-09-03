<?php

namespace App\Models\Reports;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "reports";
    protected $guarded = [];

     /*
    * Relationship with flight plans table
    */
    function flight_plans(){
        return $this->hasOne("App\Models\FlightPlans\FlightPlansModel", "report_id");
    }
}
