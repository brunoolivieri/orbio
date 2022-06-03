<?php

namespace App\Models\Drones;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DronesModel extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $table = "drones";

    /**
     * Carrega os registros no formato de paginação
     * A claúsula where é opcional
     * A claúsula when() permite criar queries condicionais
     *
     * @param array $data
     * @return array
     */
    function loadDronesWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{   

            $data = DB::table('drones')
            ->where("drones.deleted_at", null)
            ->when($where_value, function ($query, $where_value) {

                $query->when(is_numeric($where_value), function($query) use ($where_value){

                    $query->where('drones.id', $where_value)
                    ->orWhere('drones.weight', $where_value);

                }, function($query) use ($where_value){

                    $query->where('drones.name', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('drones.manufacturer', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('drones.model', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('drones.record_number', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('drones.serial_number', 'LIKE', '%'.$where_value.'%');


                });

            })->orderBy('drones.id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);
           
            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Get all drone data.
     *
     * @param int $drone_id
     * @return array
     */
    function loadAllDroneData(int $drone_id) : array {

        try{

            $drone = DronesModel::find($drone_id);

            return ["status" => true, "error" => false, "drone_data" => $drone];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
