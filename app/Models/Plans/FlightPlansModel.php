<?php

namespace App\Models\plans;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class FlightPlansModel extends Model
{

    use HasFactory;

    protected $table = "flight_plans";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";
    protected $guarded = [];

    function incidents(){

        return $this->belongsTo("App\Models\Incidents\IncidentsModel", "id_incidente");

    }

    function reports(){

        return $this->belongsTo("App\Models\Reports\ReportsModel", "id_relatorio");

    }

    function service_orders(){

        return $this->hasMany("App\Models\Orders\ServiceOrderHasUserModel", "id_plano_voo");

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

            $data = DB::table('flight_plans')
            ->select('id', 'id_relatorio', 'id_incidente', 'arquivo', 'descricao', 'status', 'dh_criacao', 'dh_atualizacao')
            ->when($where_value, function ($query, $where_value) {

                $query->where('id', $where_value);

            })->orderBy('id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
