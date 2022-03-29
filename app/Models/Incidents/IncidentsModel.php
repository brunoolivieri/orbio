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

            IncidentsModel::create($data);

            return ["status" => true, "error" => false];
            
        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

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

            $allIncidents = DB::table('incidents')
            ->offset($offset)->limit($limit)->get();

            if($allIncidents){

                $response = [
                    "referencialValueForCalcPages" => count($allIncidents),
                    "selectedRecords" => $allIncidents
                ];

                return ["status" => true, "error" => false, "data" => $response];

            }

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

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

            return ["status" => true, "error" => false, "data" => $response];

        }catch(\Exception $e){

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

            IncidentsModel::where('id', $incident_id)->update($data);

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

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

            IncidentsModel::where('id', $incident_id)->delete();

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }



}
