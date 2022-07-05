<?php

namespace App\Services\Modules\Equipment;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// Custom
use App\Models\Drones\DroneModel;
use App\Http\Requests\Modules\Equipments\Drone\StoreDroneRequest;
use App\Http\Requests\Modules\Equipments\Drone\UpdateDroneRequest;
use App\Services\FormatDataService;

class DroneService {

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
    * Load all drones with pagination.
    *
    * @param int $limit
    * @param int $current_page
    * @param int|string $where_value
    * @return \Illuminate\Http\Response
    */
    public function loadDronesWithPagination(int $limit, int $current_page, int|string $where_value){

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

        if($data->total() > 0){

            $data_formated = $this->format_data_service->genericEquipmentDataFormatting($data, "drone");

            return response($data_formated, 200);

        }else{

            return response(["message" => "Nenhum drone encontrado."], 404);

        }

    }

    /**
     * Create drone.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createDrone(Request $request) {

        DB::transaction(function () use ($request) {

            // Filename is the hash of the content
            $content_hash = md5(file_get_contents($request->file('image'))); 
            $filename = "$content_hash.jpg";
            $storage_folder = "public/images/drone/";

            DroneModel::create([...$request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]), "image" => $filename]);

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($storage_folder.$filename)) {
                $path = $request->file('image')->storeAs($storage_folder, $filename);
            }

        });

        return response(["message" => "Drone criado com sucesso!"], 200);

    }

    /**
     * Update drone.
     *
     * @param  \Illuminate\Http\Request $request
     * @param $drone_id
     * @return \Illuminate\Http\Response
     */
    public function updateDrone(Request $request, $drone_id) {

        DB::transaction(function () use ($request, $drone_id) {

            $drone = DroneModel::findOrFail($drone_id);

            if(!empty($request->image)){

                // Filename is the hash of the content
                $content_hash = md5(file_get_contents($request->file('image'))); 
                $filename = "$content_hash.jpg";
                $storage_folder = "public/images/drone/";

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($storage_folder.$filename)) {
                    $path = $request->file('image')->storeAs($storage_folder, $filename);
                }

                $drone->update([...$request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]), "image" => $filename]);

            }else{

                $drone->update([...$request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"])]);

            }  

        });

        return response(["message" => "Drone atualizado com sucesso!"], 200);

    }

    /**
     * Soft delete drone.
     *
     * @param int $drone_id
     * @return \Illuminate\Http\Response
     */
    public function deleteDrone($drone_id) {
        
        DB::transaction(function() use ($drone_id){

            $drone = DroneModel::findOrFail($id);

            Storage::disk('public')->delete("images/drone/".$drone->image);

            $drone->delete();

        });

        return response(["message" => "Drone deletado com sucesso!"], 200);

    }
    
}