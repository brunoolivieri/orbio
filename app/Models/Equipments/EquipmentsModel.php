<?php

namespace App\Models\Equipments;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class EquipmentsModel extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $table = "equipments";

    /**
     * Carrega os registros no formato de paginação
     * A claúsula where é opcional
     * A claúsula when() permite criar queries condicionais
     *
     * @param array $data
     * @return array
     */
    function loadEquipmentsWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{
            
            $data = DB::table('equipments')
            ->where("equipments.deleted_at", null)
            ->when($where_value, function ($query, $where_value) {

                $query->when(is_numeric($where_value), function($query) use ($where_value){

                    $query->where('equipments.id', $where_value)
                    ->orWhere('equipments.weight', $where_value);

                }, function($query) use ($where_value){

                    $query->where('equipments.name', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('equipments.manufacturer', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('equipments.model', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('equipments.record_number', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('equipments.serial_number', 'LIKE', '%'.$where_value.'%');

                });

            })->orderBy('equipments.id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Get all equipment data.
     *
     * @param int $drone_id
     * @return array
     */
    function loadAllEquipmentData(int $equipment_id) : array {

        try{

            $equipment = EquipmentsModel::find($equipment_id);

            return ["status" => true, "error" => false, "equipment_data" => $equipment];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }
}
