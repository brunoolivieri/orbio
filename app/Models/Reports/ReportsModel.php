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

            // Inicialização da transação
            DB::beginTransaction();

            $this->dh_inicio_voo = $data["flight_start_date"];
            $this->dh_fim_voo = $data["flight_end_date"];
            $this->log_voo = $data["flight_log"];
            $this->observacao = $data["flight_note"];

            // Se a inserção na tabela "users" for bem sucedida
            if($insert = $this->save()){

                // Se a operação for bem sucedida, confirmar
                DB::commit();

                // Retornar Status 200 com o ID da inserção
                return ["status" => true, "error" => false];

            }else{

                // Se a operação falhar, desfazer as transações
                DB::rollBack();

                // Retornar resposta com erro do tipo "genérico"
                return ["status" => false, "error" => true];

            }

        }catch(\Exception $e){

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            // Retornar resposta com erro do tipo "genérico"
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

            // Inicialização da transação
            DB::beginTransaction();

            // Query Builder para fazer o relacionamento
            $allReports = DB::table('reports')
            ->select('id', 'dh_criacao', 'dh_inicio_voo', 'dh_fim_voo', 'log_voo', 'observacao')
            ->offset($offset)->limit($limit)->get();

            dd($allReports);

            if($allReports){

                // A paginação é criada com base no total de registros por página. Com LIMIT 10 e 30 registros, serão 3 páginas com 10 registros cada.
                // Portanto esse valor, do total de registros existentes, é necessário.
                $totalTableRecords = ReportsModel::all()->count();

                $response = [
                    "referencialValueForCalcPages" => $totalTableRecords,
                    "selectedRecords" => $allReports
                ];

                // Se a operação for bem sucedida, confirmar
                DB::commit();

                return ["status" => true, "error" => false, "data" => $response];

            }

        }catch(\Exception $e){

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            // Retornar resposta com erro do tipo "genérico"
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

            // Inicialização da transação
            DB::beginTransaction();

        }catch(\Exception $e){

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            // Retornar resposta com erro do tipo "genérico"
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
    function updateReportData(int $report_id, array $data) : array {

        try{

            // Inicialização da transação
            DB::beginTransaction();

            $update = ReportsModel::where('id', $report_id)->update($data);

            if($update){

                // Se a operação for bem sucedida, confirmar
                DB::commit();

                return ["status" => true, "error" => false];

            }else{

                // Se a operação falhar, desfazer as transações
                DB::rollBack();

                return ["status" => false, "error" => true];

            }

        }catch(\Exception $e){

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            // Retornar resposta com erro do tipo "genérico"
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

            // Inicialização da transação
            DB::beginTransaction();

            $delete = ReportsModel::where('id', $report_id)->delete();

            if($delete){

                // Se a operação for bem sucedida, confirmar
                DB::commit();

                return ["status" => true, "error" => false];

            }else{

                // Se a operação falhar, desfazer as transações
                DB::rollBack();

                return ["status" => false, "error" => true];

            }

        }catch(\Exception $e){

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            // Retornar resposta com erro do tipo "genérico"
            return ["status" => false, "error" => true];

        }

    }


}
