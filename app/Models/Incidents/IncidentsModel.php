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
     * Método realizar um INSERT na tabela "incidents"
     *
     * @param array $data
     * @return array
     */
    function newIncident(array $data) : array {

        try{

            DB::beginTransaction();

            if($insert = IncidentsModel::create($data)){

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
     * Método realizar um SELECT SEM WHERE na tabela "incidents"
     * Os registros selecionados preencherão uma única página da tabela
     * A quantidade por página é definida pelo LIMIT, e o número da página pelo OFFSET
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadAllIncidents(int $offset, int $limit) : array {

        try{

            DB::beginTransaction();

            $allIncidents = DB::table('incidents')
            ->offset($offset)->limit($limit)->get();

            if($allIncidents){

                $response = [
                    "referencialValueForCalcPages" => count($allIncidents),
                    "selectedRecords" => $allIncidents
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
     * Método realizar um SELECT COM WHERE na tabela "incidents"
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadSpecificIncidents(string $value_searched, int $offset, int $limit) : array {

        try{

            $searchedIncidents = DB::table('incidents')
            ->where('incidents.id', $value_searched)
            ->offset($offset)->limit($limit)->get();

            $response = [
                "referencialValueForCalcPages" => count($searchedIncidents),
                "selectedRecords" => $searchedIncidents
            ];

            DB::beginTransaction();

            return ["status" => true, "error" => false, "data" => $response];

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => true];

        }

    }

    /**
     * Método realizar um UPDATE em um registro especifico da tabela "incidents"
     *
     * @param int $incident_id
     * @param array $data
     * @return array
     */
    function updateIncident(int $incident_id, array $data) : array {

        try{

            DB::beginTransaction();

            $update = IncidentsModel::where('id', $incident_id)->update($data);

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
     * Método realizar um DELETE em um registro especifico da tabela "incidents"
     *
     * @param int $incident_id
     * @return array
     */
    function deleteIncident(int $incident_id) : array {

        try{

            DB::beginTransaction();

            $delete = IncidentsModel::where('id', $incident_id)->delete();

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
