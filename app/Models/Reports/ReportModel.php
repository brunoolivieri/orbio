<?php

namespace App\Models\Reports;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "reports";
    protected $guarded = [];

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
            ->select('reports.id', 'reports.created_at', 'reports.updated_at', 'reports.start_date', 'reports.end_date', 'reports.flight_log', 'reports.observation')
            ->where("reports.deleted_at", null)
            ->when($where_value, function ($query, $where_value) {

                $query->where('id', $where_value);

            })->orderBy('id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }
}
