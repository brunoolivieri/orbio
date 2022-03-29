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
     * Método realizar um INSERT na tabela "reports"
     *
     * @param array $data
     * @return array
     */
    function newReport(array $data) : array {

        try{

            ReportsModel::insert($data);

            return ["status" => true, "error" => false];
            
        }catch(\Exception $e){
            
            return ["status" => false, "error" => $e->getMessage()];

        }

    }

     /**
     * Método realizar um SELECT SEM WHERE na tabela "reports"
     * Os registros selecionados preencherão uma única página da tabela
     * A quantidade por página é definida pelo LIMIT, e o número da página pelo OFFSET
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadAllReports(int $offset, int $limit) : array {

        try{

            $allReports = DB::table('reports')
            ->select('id', 'dh_criacao', 'dh_atualizacao', 'dh_inicio_voo', 'dh_fim_voo', 'log_voo', 'observacao')
            ->offset($offset)->limit($limit)->get();

            if($allReports){

                $response = [
                    "referencialValueForCalcPages" => count($allReports),
                    "selectedRecords" => $allReports
                ];

                return ["status" => true, "error" => false, "data" => $response];

            }

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Método realizar um SELECT COM WHERE na tabela "reports"
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadSpecificReports(string $value_searched, int $offset, int $limit) : array {

        try{

            $searchedReports = DB::table('reports')
            ->select('id', 'dh_criacao', 'dh_atualizacao', 'dh_inicio_voo', 'dh_fim_voo', 'log_voo', 'observacao')
            ->where('reports.id', $value_searched)
            ->offset($offset)->limit($limit)->get();

            $response = [
                "referencialValueForCalcPages" => count($searchedReports),
                "selectedRecords" => $searchedReports
            ];

            return ["status" => true, "error" => false, "data" => $response];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Método realizar um UPDATE em um registro especifico da tabela "reports"
     *
     * @param int $report_id
     * @param array $data
     * @return array
     */
    function updateReport(int $report_id, array $data) : array {

        try{

            ReportsModel::where('id', $report_id)->update($data);

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Método realizar um DELETE em um registro especifico da tabela "users"
     *
     * @param int $report_id
     * @return array
     */
    function deleteReport(int $report_id) : array {

        try{

            ReportsModel::where('id', $report_id)->delete();

            return ["status" => true, "error" => false];

        }catch(\Exception $e){
         
            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
