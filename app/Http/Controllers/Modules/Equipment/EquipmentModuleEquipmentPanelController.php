<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
// Models
use App\Models\Equipments\EquipmentsModel;
// Form Request
use App\Http\Requests\Modules\Equipments\Equipment\StoreEquipmentRequest;
use App\Http\Requests\Modules\Equipments\Equipment\UpdateEquipmentRequest;

class EquipmentModuleEquipmentPanelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new EquipmentsModel();
            
        $model_response = $model->loadEquipmentsWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('equipment_error')->info("[Método: Index][Controlador: EquipmentModuleEquipmentPanelController] - Nenhum registro de equipamento encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('equipment_error')->error("[Método: Index][Controlador: EquipmentModuleEquipmentPanelController] - Os registros não foram carregados - Erro: ".$model_response["error"]);

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
                "equipment_id" => $record->id,
                "image_url" => Storage::url("images/equipments/".$record->image),
                "image" => $record->image,
                "name" => $record->name,
                "manufacturer" => $record->manufacturer,
                "model" => $record->model,
                "record_number" => $record->record_number,
                "serial_number" => $record->serial_number,
                "weight" => $record->weight,
                "observation" => $record->observation,
                "purchate_date" => $record->purchase_date,
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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreEquipmentRequest $request)
    {
        try{

            DB::transaction(function () use ($request) {

                $filename = $request->image->getClientOriginalName();
                $storage_folder = "public/images/equipments/";

                EquipmentsModel::create([...$request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"]), "image" => $filename]);

                $path = $request->file('image')->storeAs($storage_folder, $filename);

            });

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('equipment_error')->error("[Método: Store][Controlador: EquipmentModuleDronePanelController] - Falha na criação do equipamento - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }    
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new EquipmentsModel();
            
        $model_response = $model->loadEquipmentsWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('equipment_error')->info("[Método: Index][Controlador: EquipmentModuleEquipmentPanelController] - Nenhum registro de equipamento encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('equipment_error')->error("[Método: Index][Controlador: EquipmentModuleEquipmentPanelController] - Os registros não foram carregados - Erro: ".$model_response["error"]);

            return response(["error" => $model_response->content()], 500);

        } 
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateEquipmentRequest $request, $id)
    {
        try{

            DB::transaction(function () use ($request, $id) {

                $equipment = EquipmentsModel::find($id);

                Storage::disk('public')->delete("images/equipments/".$equipment->image);

                $filename = $request->image->getClientOriginalName();
                $storage_folder = "public/images/equipments/";

                $equipment->update([...$request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"]), "image" => $filename]);

                $path = $request->file('image')->storeAs($storage_folder, $filename);

            });

            Log::channel('equipment_action')->info("[Método: Update][Controlador: EquipmentModuleDronePanelController] - Equipamento atualizado com sucesso - ID do equipamento: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('equipment_error')->error("[Método: Update][Controlador: EquipmentModuleDronePanelController] - Falha na atualização do equipamento - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{

            DB::transaction(function () use ($id) {

                $equipment = EquipmentsModel::find($id);

                Storage::disk('public')->delete("images/equipments/".$equipment->image);

                $equipment->delete();

            });

            Log::channel('equipment_action')->info("[Método: Destroy][Controlador: EquipmentModuleDronePanelController] - Equipamento removido com sucesso - ID do equipamento: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('equipment_error')->error("[Método: Destroy][Controlador: EquipmentModuleDronePanelController] - Equipamento não foi removido - ID do equipamento: ".$id." - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }
    }
}
