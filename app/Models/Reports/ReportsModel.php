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

     /**
     * Método realizar um INSERT na tabela "reports"
     *
     * @param array $data
     * @return array
     */
    function newReport(array $data) : array {

        try{

            
            DB::beginTransaction();

            $this->dh_inicio_voo = $data["flight_start_date"];
            $this->dh_fim_voo = $data["flight_end_date"];
            $this->log_voo = $data["flight_log"];
            $this->observacao = $data["report_note"];

            // Se a inserção na tabela "users" for bem sucedida
            if($insert = $this->save()){

                DB::commit();

                return ["status" => true, "error" => false];

            }else{

                DB::rollBack();

                return ["status" => false, "error" => true];

            }

        }catch(\Exception $e){
            
            DB::rollBack();
            
            return ["status" => false, "error" => true];

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

            DB::beginTransaction();

            $allReports = DB::table('reports')
            ->select('id', 'dh_criacao', 'dh_atualizacao', 'dh_inicio_voo', 'dh_fim_voo', 'log_voo', 'observacao')
            ->offset($offset)->limit($limit)->get();

            if($allReports){

                $response = [
                    "referencialValueForCalcPages" => count($allReports),
                    "selectedRecords" => $allReports
                ];

                DB::commit();

                return ["status" => true, "error" => false, "data" => $response];

            }

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => true];

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

            DB::beginTransaction();

            return ["status" => true, "error" => false, "data" => $response];

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => true];

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

            
            DB::beginTransaction();

            ReportsModel::where('id', $report_id)->update($data);

            DB::commit();

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => true];

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

            
            DB::beginTransaction();

            ReportsModel::where('id', $report_id)->delete();

            DB::commit();

            return ["status" => true, "error" => false];

        }catch(\Exception $e){
            
            DB::rollBack();
         
            return ["status" => false, "error" => true];

        }

    }

}
