<?php

namespace App\Services\Modules\Equipment;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// Custom
use App\Models\Batteries\BatteryModel;
use App\Http\Requests\Modules\Equipments\Drone\StoreDroneRequest;
use App\Http\Requests\Modules\Equipments\Drone\UpdateDroneRequest;
use App\Services\FormatDataService;

class BatteryService{
    
    private FormatDataService $format_data_service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\FormatDataService $service
     */
    public function __construct(FormatDataService $service){
        $this->format_data_service = $service;
    }

    /**
    * Load all batteries with pagination.
    *
    * @param int $limit
    * @param int $current_page
    * @param int|string $where_value
    * @return \Illuminate\Http\Response
    */
    public function loadBatteriesWithPagination(int $limit, int $current_page, int|string $where_value){

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

        if($data->total() > 0){

            $data_formated = $this->format_data_service->genericEquipmentDataFormatting($data, "battery");

            return response($data_formated, 200);

        }else{

            return response(["message" => "Nenhuma bateria encontrada."], 404);

        }

    }

    /**
     * Create battery.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createBattery(Request $request) {

        DB::transaction(function () use ($request) {

            // Filename is the hash of the content
            $content_hash = md5(file_get_contents($request->file('image'))); 
            $filename = "$content_hash.jpg";
            $storage_folder = "public/images/battery/";

            BatteryModel::create([...$request->only(["name", "manufacturer", "model", "serial_number", "last_charge"]), "image" => $filename]);

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($storage_folder.$filename)) {
                $path = $request->file('image')->storeAs($storage_folder, $filename);
            }

        });

        return response(["message" => "Bateria criada com sucesso!"], 200);

    }

    /**
     * Update battery.
     *
     * @param  \Illuminate\Http\Request $request
     * @param $battery_id
     * @return \Illuminate\Http\Response
     */
    public function updateBattery(Request $request, int $battery_id) {

        DB::transaction(function () use ($request, $battery_id) {

            $battery = BatteryModel::findOrFail($battery_id);

            if(!empty($request->image)){

                // Filename is the hash of the content
                $content_hash = md5(file_get_contents($request->file('image'))); 
                $filename = "$content_hash.jpg";
                $storage_folder = "public/images/battery/";

                $battery->update([...$request->only(["name", "manufacturer", "model", "serial_number", "last_charge"]), "image" => $filename]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($storage_folder.$filename)) {
                    $path = $request->file('image')->storeAs($storage_folder, $filename);
                }

            }else{

                $battery->update([...$request->only(["name", "manufacturer", "model", "serial_number", "last_charge"])]);

            } 

        });

        return response(["message" => "Bateria atualizada com sucesso!"], 200);

    }

    /**
     * Soft delete battery.
     *
     * @param $battery_id
     * @return \Illuminate\Http\Response
     */
    public function deleteBattery(int $battery_id) {
        
        DB::transaction(function() use ($battery_id){

            $battery = BatteryModel::findOrFail($battery_id);

            Storage::disk('public')->delete("images/batteries/".$battery->image);

            $battery->delete();

        });

        return response(["message" => "Bateria deletada com sucesso!"], 200);

    }

}