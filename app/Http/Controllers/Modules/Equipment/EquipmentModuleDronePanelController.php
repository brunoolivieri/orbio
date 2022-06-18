<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Models\Drones\DroneModel;
use App\Http\Requests\Modules\Equipments\Drone\StoreDroneRequest;
use App\Http\Requests\Modules\Equipments\Drone\UpdateDroneRequest;
use App\Services\FormatDataService;

class EquipmentModuleDronePanelController extends Controller
{

    private FormatDataService $format_data_service;
    private DroneModel $drone_model;

    /**
     * Dependency injection.
     * 
     * @param App\Models\Drones\DroneModel $drone
     */
    public function __construct(FormatDataService $service, DroneModel $drone){
        $this->format_data_service = $service;
        $this->drone_model = $drone;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_read");

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];
            
        $model_response =  $this->drone_model->loadDronesWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->format_data_service->genericDataFormatting($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('equipment_error')->info("[Método: Index][Controlador: EquipmentModuleDronePanelController] - Nenhum registro de drone encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('equipment_error')->error("[Método: Index][Controlador: EquipmentModuleDronePanelController] - Os registros não foram carregados - Erro: ".$model_response["error"]);

            return response(["error" => $model_response->content()], 500);

        }  
    }

    /**
     * Method for organize data for the frontend table.
     *
     * @param Illuminate\Pagination\LengthAwarePaginator $data
     * @return array
     */
    private function formatDataForTable(LengthAwarePaginator $data) : array {

        $arr_with_formated_data = [];

        foreach($data->items() as $row => $record){

            $created_at_formated = date( 'd-m-Y h:i', strtotime($record->created_at));
            $updated_at_formated = $record->updated_at == null ? "Sem dados" : date( 'd-m-Y h:i', strtotime($record->updated_at));
            
            $arr_with_formated_data["records"][$row] = array(
                "drone_id" => $record->id,
                "image_url" => Storage::url("images/drones/".$record->image),
                "image" => $record->image,
                "name" => $record->name,
                "manufacturer" => $record->manufacturer,
                "model" => $record->model,
                "record_number" => $record->record_number,
                "serial_number" => $record->serial_number,
                "weight" => $record->weight,
                "observation" => $record->observation,
                "created_at" => $created_at_formated,
                "updated_at" => $updated_at_formated
            );

        }

        $arr_with_formated_data["total_records_founded"] = $data->total();
        $arr_with_formated_data["records_per_page"] = $data->perPage();
        $arr_with_formated_data["total_pages"] = $data->lastPage();

        return $arr_with_formated_data;

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param App\Http\Requests\Modules\Equipments\Drone\StoreDroneRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreDroneRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        try{

            DB::transaction(function () use ($request) {

                // Filename is the hash of the content
                $content_hash = md5(file_get_contents($request->file('image'))); 
                $filename = "$content_hash.jpg";
                $storage_folder = "public/images/drones/";

                DroneModel::create([...$request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]), "image" => $filename]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($storage_folder.$filename)) {
                    $path = $request->file('image')->storeAs($storage_folder, $filename);
                }

            });

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('equipment_error')->error("[Método: Store][Controlador: EquipmentModuleDronePanelController] - Falha na criação do drone - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }       
    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_read");

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];
            
        $model_response =  $this->drone_model->loadDronesWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->format_data_service->genericDataFormatting($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('equipment_error')->info("[Método: Index][Controlador: EquipmentModuleDronePanelController] - Nenhum registro de drone encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('equipment_error')->error("[Método: Index][Controlador: EquipmentModuleDronePanelController] - Os registros não foram carregados - Erro: ".$model_response["error"]);

            return response(["error" => $model_response->content()], 500);

        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\Equipments\Drone\UpdateDroneRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateDroneRequest $request, $id) : \Illuminate\Http\Response
    {

        Gate::authorize("equipments_write");

        try{

            DB::transaction(function () use ($request, $id) {

                $drone = DroneModel::find($id);

                if(!empty($request->image)){

                    // Filename is the hash of the content
                    $content_hash = md5(file_get_contents($request->file('image'))); 
                    $filename = "$content_hash.jpg";
                    $storage_folder = "public/images/drones/";

                    // Image is stored just if does not already exists
                    if (!Storage::disk('public')->exists($storage_folder.$filename)) {
                        $path = $request->file('image')->storeAs($storage_folder, $filename);
                    }

                    $drone->update([...$request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]), "image" => $filename]);

                }else{

                    $drone->update([...$request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"])]);

                }  

            });

            Log::channel('equipment_action')->info("[Método: Update][Controlador: EquipmentModuleDronePanelController] - Drone atualizado com sucesso - ID do drone: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('equipment_error')->error("[Método: Update][Controlador: EquipmentModuleDronePanelController] - Falha na atualização do drone - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        try{

            DB::transaction(function () use ($id) {

                $drone = DroneModel::find($id);

                Storage::disk('public')->delete("images/drones/".$drone->image);

                $drone->delete();

            });

            Log::channel('equipment_action')->info("[Método: Destroy][Controlador: EquipmentModuleDronePanelController] - Drone removido com sucesso - ID do drone: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('equipment_error')->error("[Método: Destroy][Controlador: EquipmentModuleDronePanelController] - Drone não foi removido - ID do drone: ".$id." - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }

    }
}
