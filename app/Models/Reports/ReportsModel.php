<?php

namespace App\Models\Reports;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ReportsModel extends Model
{
    use HasFactory;

    protected $table = "reports";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";
    protected $fillable = ["*"];

     /**
     * Método realizar um SELECT SEM WHERE na tabela "reports"
     * Os registros selecionados preencherão uma única página da tabela
     * A quantidade por página é definida pelo LIMIT, e o número da página pelo OFFSET
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadAReportsWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{

            $data = DB::table('reports')
            ->select('id', 'dh_criacao', 'dh_atualizacao', 'dh_inicio_voo', 'dh_fim_voo', 'log_voo', 'observacao')
            ->when($where_value, function ($query, $where_value) {

                $query->where('id', $where_value);

            })->orderBy('id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
