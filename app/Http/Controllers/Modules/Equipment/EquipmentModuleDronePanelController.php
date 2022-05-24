<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
// Models
use App\Models\Drones\DronesModel;
// Form Request
use App\Http\Requests\Modules\Equipments\Drone\StoreDroneRequest;
use App\Http\Requests\Modules\Equipments\Drone\UpdateDroneRequest;

class EquipmentModuleDronePanelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {
        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new DronesModel();
            
        $model_response = $model->loadDronesWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('administration_error')->info("[Método: Index][Controlador: AdministrationModuleUserPanelController] - Nenhum registro de usuário encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('administration_error')->error("[Método: Index][Controlador: AdministrationModuleUserPanelController] - Os registros não foram carregados - Erro: ".$model_response["error"]);

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
                "drone_id" => $record->id,
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
    public function store(StoreDroneRequest $request) : \Illuminate\Http\Response
    {dd($request->only(["image", "name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]));
        try{

            DB::transaction(function () use ($request) {

                DroneModel::create($request->only(["image", "name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]));

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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) : \Illuminate\Http\Response
    {
        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new DronesModel();
            
        $model_response = $model->loadDronesWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

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
    public function update(UpdateDroneRequest $request, $id) : \Illuminate\Http\Response
    {
        try{

            UserModel::where('id', $id)->update($request->only(["image", "name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]));

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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {
        try{

            DroneModel::where("id", $id)->delete();

            Log::channel('equipment_action')->info("[Método: Destroy][Controlador: EquipmentModuleDronePanelController] - Drone removido com sucesso - ID do drone: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('equipment_error')->error("[Método: Destroy][Controlador: EquipmentModuleDronePanelController] - Drone não foi removido - ID do drone: ".$id." - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }

    }
}
