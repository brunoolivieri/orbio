<?php

namespace App\Models\FlightPlans;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlightPlanModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "flight_plans";
    protected $fillable = ["*"];

    /*
    * Relationship with incidents table
    */
    function incidents(){

        return $this->belongsTo("App\Models\Incidents\IncidentModel", "incident_id");

    }

    /*
    * Relationship with reports table
    */
    function reports(){

        return $this->belongsTo("App\Models\Reports\ReportModel", "report_id");

    }

    /*
    * Relationship with service_orders table
    */
    function service_orders(){

        return $this->hasMany("App\Models\Orders\ServiceOrderModel", "flight_plan_id");

    }

    /*
    * Relationship with service_order_has_flight_plan table
    */
    function service_order_has_flight_plan(){

        return $this->hasMany("App\Models\Pivot\ServiceOrdersHasFlightPlansModel", "flight_plan_id");

    }

    /**
     * Método realizar um SELECT SEM WHERE na tabela "flight_plans"
     *
     * @param int $limit
     * @param int $current_page
     * @param bool|string $where_value
     * @return array
     */
    function loadFlightPlansWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{

            $data = DB::table('flight_plans')
            ->select('id', 'report_id', 'incident_id', 'file', 'description', 'status', 'created_at', 'updated_at', 'deleted_at')
            ->where("flight_plans.deleted_at", null)
            ->when($where_value, function ($query, $where_value) {

                $query->where('id', $where_value);

            })->orderBy('id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }
}
