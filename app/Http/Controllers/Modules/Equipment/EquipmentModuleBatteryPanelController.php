<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
// Models
use App\Models\Batteries\BatteriesModel;
// Form Request
use App\Http\Requests\Modules\Equipments\Battery\StoreBatteryRequest;
use App\Http\Requests\Modules\Equipments\Battery\UpdateBatteryRequest;

class EquipmentModuleBatteryPanelController extends Controller
{
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

        $model = new BatteriesModel();
            
        $model_response = $model->loadBatteriesWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('equipment_error')->info("[Método: Index][Controlador: EquipmentModuleBatteryPanelController] - Nenhum registro de bateria encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('equipment_error')->error("[Método: Index][Controlador: EquipmentModuleBatteryPanelController] - Os registros não foram carregados - Erro: ".$model_response["error"]);

            return response(["error" => $model_response->content()], 500);

        } 
    }

    /**
     * Form data for frontend table.
     *
     * @return array
     */
    private function formatDataForTable(LengthAwarePaginator $data) : array {

        $arr_with_formated_data = [];

        foreach($data->items() as $row => $record){

            $created_at_formated = date( 'd-m-Y h:i', strtotime($record->created_at));
            $updated_at_formated = $record->updated_at == null ? "Sem dados" : date( 'd-m-Y h:i', strtotime($record->updated_at));
            
            $arr_with_formated_data["records"][$row] = array(
                "battery_id" => $record->id,
                "image_url" => Storage::url("images/batteries/".$record->image),
                "name" => $record->name,
                "manufacturer" => $record->manufacturer,
                "model" => $record->model,
                "serial_number" => $record->serial_number,
                "last_charge" => $record->last_charge,
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreBatteryRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        try{

            DB::transaction(function () use ($request) {

                $filename = $request->image->getClientOriginalName();
                $storage_folder = "public/images/batteries/";

                BatteriesModel::create([...$request->only(["name", "manufacturer", "model", "serial_number", "last_charge"]), "image" => $filename]);

                $path = $request->file('image')->storeAs($storage_folder, $filename);

            });

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('equipment_error')->error("[Método: Store][Controlador: EquipmentModuleBatteryPanelController] - Falha na criação da bateria - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }    
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_read");

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new BatteriesModel();
            
        $model_response = $model->loadBatteriesWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('equipment_error')->info("[Método: Index][Controlador: EquipmentModuleBatteryPanelController] - Nenhum registro de bateria encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('equipment_error')->error("[Método: Index][Controlador: EquipmentModuleBatteryPanelController] - Os registros não foram carregados - Erro: ".$model_response["error"]);

            return response(["error" => $model_response->content()], 500);

        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateBatteryRequest $request, $id) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        try{

            DB::transaction(function () use ($request, $id) {

                $battery = BatteriesModel::find($id);

                Storage::disk('public')->delete("images/batteries/".$battery->image);

                $filename = $request->image->getClientOriginalName();
                $storage_folder = "public/images/batteries/";

                $battery->update([...$request->only(["name", "manufacturer", "model", "serial_number", "last_charge"]), "image" => $filename]);

                $path = $request->file('image')->storeAs($storage_folder, $filename);

            });

            Log::channel('equipment_action')->info("[Método: Update][Controlador: EquipmentModuleBatteryPanelController] - Bateria atualizado com sucesso - ID da bateria: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('equipment_error')->error("[Método: Update][Controlador: EquipmentModuleBatteryPanelController] - Falha na atualização da bateria - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        try{

            DB::transaction(function () use ($id) {

                $battery = BatteriesModel::find($id);

                Storage::disk('public')->delete("images/batteries/".$battery->image);

                $battery->delete();

            });

            Log::channel('equipment_action')->info("[Método: Destroy][Controlador: EquipmentModuleBatteryPanelController] - Bateria removida com sucesso - ID da bateria: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('equipment_error')->error("[Método: Destroy][Controlador: EquipmentModuleBatteryPanelController] - Falha na deleção do registro da bateria - ID da bateria: ".$id." - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }
    }
}
