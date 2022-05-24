<?php

namespace App\Models\Batteries;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class BatteriesModel extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * Carrega os registros no formato de paginação
     * A claúsula where é opcional
     * A claúsula when() permite criar queries condicionais
     *
     * @param array $data
     * @return array
     */
    function loadBatteriesWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{
            
            $data = DB::table('batteries')
            ->where("batteries.deleted_at", null)
            ->when($where_value, function ($query, $where_value) {

                $query->when(is_numeric($where_value), function($query) use ($where_value){

                    $query->where('batteries.id', $where_value);

                }, function($query) use ($where_value){

                    $query->where('batteries.name', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('batteries.manufacturer', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('batteries.model', 'LIKE', '%'.$where_value.'%')
                    ->orWhere('batteries.serial_number', 'LIKE', '%'.$where_value.'%');

                });

            })->orderBy('batteries.id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Get all battery data.
     *
     * @param int $drone_id
     * @return array
     */
    function loadAllBatteryData(int $battery_id) : array {

        try{

            $battery = BatteriesModel::find($battery_id);

            return ["status" => true, "error" => false, "battery_data" => $battery];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }
}
