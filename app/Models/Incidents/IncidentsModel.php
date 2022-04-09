<?php

namespace App\Models\Incidents;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class IncidentsModel extends Model
{
    use HasFactory;

    protected $table = "incidents";
    public $timestamps = false;
    protected $guarded = [];

    /**
     * Método realizar um SELECT SEM WHERE na tabela "incidents"
     * Os registros selecionados preencherão uma única página da tabela
     * A quantidade por página é definida pelo LIMIT, e o número da página pelo OFFSET
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadIncidentsWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{

            $data = DB::table('incidents')
            ->when($where_value, function ($query, $where_value) {

                $query->where('id', $where_value);

            })->orderBy('id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
