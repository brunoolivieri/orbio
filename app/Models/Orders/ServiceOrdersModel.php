<?php

namespace App\Models\Orders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ServiceOrdersModel extends Model
{
    use HasFactory;

    protected $table = "service_orders";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";
    protected $guarded = []; 

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
            ->when($where_value, function ($query, $where_value) {

                $query->where('service_orders.id', $where_value);

            })->orderBy('service_orders.id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
