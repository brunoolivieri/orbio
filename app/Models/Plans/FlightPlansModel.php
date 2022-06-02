<?php

namespace App\Models\Plans;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class FlightPlansModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "flight_plans";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";
    protected $guarded = [];

    /*
    * Relationship with incidents table
    */
    function incidents(){

        return $this->belongsTo("App\Models\Incidents\IncidentsModel", "id_incidente");

    }

    /*
    * Relationship with reports table
    */
    function reports(){

        return $this->belongsTo("App\Models\Reports\ReportsModel", "id_relatorio");

    }

    /*
    * Relationship with service_orders table
    */
    function service_orders(){

        return $this->hasMany("App\Models\Orders\ServiceOrdersModel", "id_plano_voo");

    }

    /*
    * Relationship with service_order_has_flight_plan table
    */
    function service_order_has_flight_plan(){

        return $this->hasMany("App\Models\Orders\ServiceOrdersHasFlightPlansModel", "id_plano_voo");

    }

    /**
     * Método realizar um SELECT SEM WHERE na tabela "flight_plans"
     * Os registros selecionados preencherão uma única página da tabela
     * A quantidade por página é definida pelo LIMIT, e o número da página pelo OFFSET
     *
     * @param int $limit
     * @param int $current_page
     * @param bool|string $where_value
     * @return array
     */
    function loadFlightPlansWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{

            $cached_data = Cache::remember('flight_plans_table', $time = 60 * 60, function () use ($limit, $current_page, $where_value) {

                return DB::table('flight_plans')
                ->select('id', 'id_relatorio', 'id_incidente', 'arquivo', 'descricao', 'status', 'dh_criacao', 'dh_atualizacao', 'deleted_at')
                ->where("flight_plans.deleted_at", null)
                ->when($where_value, function ($query, $where_value) {

                    $query->where('id', $where_value);

                })->orderBy('id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            });

            return ["status" => true, "error" => false, "data" => $cached_data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
