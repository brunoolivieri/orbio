<?php

namespace App\Models\plans;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class FlightPlansModel extends Model
{

    protected $table = "flight_plans";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";

    use HasFactory;

    /**
     * Método realizar um INSERT na tabela "flight_plans"
     *
     * @param array $data
     * @return array
     */
    function newFlightPlan(array $data) : array {

        try{

            DB::beginTransaction();

            $this->id_relatorio = $data["report_id"];
            $this->id_incidente = $data["incident_id"];
            $this->arquivo = $data["plan_file"];
            $this->descricao = $data["description"];
            $this->status = $data["status"];

            if($insert = $this->save()){

                DB::commit();

                return ["status" => true, "error" => false];

            }else{

                DB::rollBack();

                return ["status" => false, "error" => true];

            }

        }catch(\Exception $e){

            dd($e);

            DB::rollBack();

            return ["status" => false, "error" => true];

        }

    }

    /**
     * Método realizar um SELECT SEM WHERE na tabela "flight_plans"
     * Os registros selecionados preencherão uma única página da tabela
     * A quantidade por página é definida pelo LIMIT, e o número da página pelo OFFSET
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadAllFlightPlans(int $offset, int $limit) : array {

        try{

            DB::beginTransaction();

            $allFlightPlans = DB::table('flight_plans')
            ->select('id', 'id_relatorio', 'id_incidente', 'arquivo', 'descricao', 'status', 'dh_criacao', 'dh_atualizacao')
            ->offset($offset)->limit($limit)->get();

            if($allFlightPlans){

                $response = [
                    "referencialValueForCalcPages" => count($allFlightPlans),
                    "selectedRecords" => $allFlightPlans
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
     * Método realizar um SELECT COM WHERE na tabela "flight_plans"
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadSpecificUsers(string $value_searched, int $offset, int $limit) : array {

        try{

            $searchedReports = DB::table('flight_plans')
            ->select('id', 'id_relatorio', 'id_incidente', 'arquivo', 'descricao', 'status')
            ->where('plans.id', $value_searched)
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
     * Método realizar um UPDATE em um registro especifico da tabela "flight_plans"
     *
     * @param int $report_id
     * @param array $data
     * @return array
     */
    function updateFlightPlans(int $plan_id, array $data) : array {

        try{

            DB::beginTransaction();

            $update = FlightPlansModel::where('id', $plan_id)->update($data);

            if($update){

                DB::commit();

                return ["status" => true, "error" => false];

            }else{

                DB::rollBack();

                return ["status" => false, "error" => true];

            }

        }catch(\Exception $e){

            dd($e);

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
    function deleteReport(int $plan_id) : array {

        try{

            DB::beginTransaction();

            $delete = FlightPlansModel::where('id', $plan_id)->delete();

            if($delete){

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


}
