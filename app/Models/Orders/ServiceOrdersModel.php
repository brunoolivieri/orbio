<?php

namespace App\Models\Orders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class ServiceOrdersModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "service_orders";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";
    protected $guarded = []; 

    /*
    * Relationship with flight_plans table
    */
    function flight_plans(){

        return $this->belongsTo("App\Models\Plans\FlightPlansModel", "id_plano_voo");

    }

    /*
    * Relationship with service_order_has_user table
    */
    function service_order_has_user(){

        return $this->hasOne("App\Models\Orders\ServiceOrderHasUserModel", "id_ordem_servico");

    }

    /*
    * Relationship with service_order_has_flight_plan table
    */
    function service_order_has_flight_plan(){

        return $this->hasMany("App\Models\Orders\ServiceOrderHasFlightPlansModel", "id_ordem_servico");

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

            $cached_data = Cache::remember('service_orders_table', $time = 60 * 60, function () use ($limit, $current_page, $where_value) {

                return DB::table('service_orders')
                ->where("service_orders.deleted_at", null)
                ->when($where_value, function ($query, $where_value) {

                    $query->where('service_orders.id', $where_value);

                })->orderBy('service_orders.id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            });

            return ["status" => true, "error" => false, "data" => $cached_data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
