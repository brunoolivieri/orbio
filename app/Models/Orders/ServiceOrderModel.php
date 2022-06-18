<?php

namespace App\Models\Orders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceOrderModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "service_orders";
    protected $fillable = ["*"];

    /*
    * Relationship with flight_plans table
    */
    function flight_plans(){

        return $this->belongsTo("App\Models\Plans\FlightPlanModel", "flight_plan_id");

    }

    /*
    * Relationship with service_order_has_user table
    */
    function service_order_has_user(){

        return $this->hasOne("App\Models\Orders\ServiceOrderHasUserModel", "service_order_id");

    }

    /*
    * Relationship with service_order_has_flight_plan table
    */
    function service_order_has_flight_plan(){

        return $this->hasMany("App\Models\Orders\ServiceOrderHasFlightPlansModel", "service_order_id");

    }

    /**
     * Carrega os registros no formato de paginação
     * A claúsula where é opcional
     * A claúsula when() permite criar queries condicionais
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadServiceOrdersWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{

            $data = DB::table('service_orders')
            ->where("service_orders.deleted_at", null)
            ->when($where_value, function ($query, $where_value) {

                $query->where('service_orders.id', $where_value);

            })->orderBy('service_orders.id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }
}
