<?php

namespace App\Http\Controllers\Modules\FlightPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Plans\FlightPlansModel;
use App\Models\Incidents\IncidentsModel;
use App\Models\Reports\ReportsModel;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
// Classes de validação das requisições store/update
use App\Http\Requests\Modules\FlightPlans\FlightPlanStoreRequest;
use App\Http\Requests\Modules\FlightPlans\FlightPlanUpdateRequest;
// Log
use Illuminate\Support\Facades\Log;

class FlightPlanModuleController extends Controller
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

        $model = new FlightPlansModel();

        $model_response = $model->loadFlightPlansWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('flight_plans_error')->error("[Método: Index][Controlador: FlightPlanModuleController] - Nenhum registro de plano de vôo foi encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('flight_plans_error')->error("[Método: Index][Controlador: FlightPlanModuleController] - Erro no carregamento dos planos de vôo - Erro: ".$model_response["error"]);

            return response(["status" => false, "error" => $model_response->content()], 500);

        }  
    }

    /**
     * Data is formated for the frontend plans table
     *
     * @param object $data
     * @return array
     */
    private function formatDataForTable(LengthAwarePaginator $data) : array {

        $arr_with_formated_data = [];

        foreach($data->items() as $row => $record){

            $created_at_formated = date( 'd-m-Y h:i', strtotime($record->dh_criacao));
            $updated_at_formated = $record->dh_atualizacao === NULL ? "Sem dados" : date( 'd-m-Y h:i', strtotime($record->dh_atualizacao));
            
            $arr_with_formated_data["records"][$row] = array(
                "plan_id" => $record->id,
                "report_id" => $record->id_relatorio,
                "incident_id" => $record->id_incidente,
                "plan_file" => $record->arquivo,
                "plan_description" => $record->descricao,
                "plan_status" => $record->status,
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
     * Download the flight plan file
     *
     * @return \Illuminate\Http\Response
     */
    public function downloadFlightPlanFile(string $filename) : \Illuminate\Http\Response {

        try{

            if(Storage::disk("public")->exists("flight_plans/$filename")){

                $path = Storage::disk("public")->path("flight_plans/$filename");
                $contents = file_get_contents($path); 
    
                Log::channel('flight_plans_action')->info("[Método: downloadFlightPlanFile][Controlador: FlightPlanModuleController] - Arquivo do plano de vôo baixado com sucesso - Arquivo: ".$path);
    
                return response($contents)->withHeaders([
                    "Content-type" => mime_content_type($path)
                ]);
        
            }else{

                Log::channel('flight_plans_error')->error("[Método: downloadFlightPlanFile][Controlador: FlightPlanModuleController] - Arquivo do plano de vôo não foi encontrado - Arquivo: ".$path);
    
                return response("", 404);

            }

        }catch(\Exception $e){

            Log::channel('flight_plans_error')->error("[Método: downloadFlightPlanFile][Controlador: FlightPlanModuleController] - Erro no download do arquivo do plano de vôo - Arquivo: ".$path." - Erro: ".$e->getMessage());

            return response("", 500);

        }
       
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() : \Illuminate\Http\Response
    {
        try{

            $table = request()->table;

            $data = DB::table($table)->get();

            Log::channel('flight_plans_action')->info("[Método: Create][Controlador: FlightPlanModuleController] - Dados da tabela ".$table." para composição do formulário foram carregados com sucesso");

            return response($data, 200);

        }catch(\Exception $e){

            Log::channel('flight_plans_error')->error("[Método: Create][Controlador: FlightPlanModuleController] - Erro no carregamento dos dados da tabela ".$table." para composição do formulário - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()]);

        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) : \Illuminate\Http\Response
    {

        try{

            $file_name = $request->flight_plan->getClientOriginalName();
            $storage_folder = "public/flight_plans";

            FlightPlansModel::create([
                "id_relatorio" => null,
                "id_incidente" => null,
                "arquivo" => $file_name,
                "descricao" => $request->description,
                "status" => 0
            ]);

            if($request->hash_file('flight_plan')){

                $path = $request->file('flight_plan')->storeAs(
                    $storage_folder, $file_name
                );

                Log::channel('flight_plans_action')->info("[Método: Store][Controlador: FlightPlanModuleController] - Plano de vôo criado com sucesso - Arquivo: ".$storage_folder."/".$file_name);

                return response("", 200);


            }else{

                Log::channel('flight_plans_error')->error("[Método: Store][Controlador: FlightPlanModuleController] - Falha na criação do plano de vôo");

                return response(["error" => $e->getMessage()], 500);

            }

        }catch(\Exception $e){

            Log::channel('flight_plans_error')->error("[Método: Store][Controlador: FlightPlanModuleController] - Falha na criação do plano de vôo - Erro: ".$e->getMessage());

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

        $model = new FlightPlansModel();

        $model_response = $model->loadFlightPlansWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('flight_plans_error')->error("[Método: Show][Controlador: FlightPlanModuleController] - Nenhum registro encontrado na pesquisa");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('flight_plans_error')->error("[Método: Show][Controlador: FlightPlanModuleController] - Erro: ".$model_response["error"]);

            return response(["status" => false, "error" => $model_response->content()], 500);

        }  

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(FlightPlanUpdateRequest $request, $id) : \Illuminate\Http\Response
    {

        try{

            FlightPlansModel::where('id', $id)->update([
                "id_relatorio" => $request->report_id,
                "id_incidente" => $request->incident_id,
                "descricao" => $request->description,
                "status" => $request->status
            ]);

            Log::channel('flight_plans_action')->info("[Método: Update][Controlador: FlightPlanModuleController] - Plano de vôo atualizado com sucesso - ID do plano de vôo: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('flight_plans_error')->error("[Método: Update][Controlador: FlightPlanModuleController] - Falha na atualização do plano de vôo - Erro: ".$e->getMessage());

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

            // DESVINCULAR E DELETAR INCIDENTE 
            // DESVINCULAR E DELETAR RELATÓRIO
            // DESVINCULAR PLANO DA ORDEM DE SERVIÇO
            // DELETAR ARQUIVO
            // DELETAR REGISTRO DO PLANO

            FlightPlansModel::where("id", $id)->delete();

            Log::channel('flight_plans_action')->info("[Método: Destroy][Controlador: FlightPlanModuleController] - Plano de vôo removido com sucesso - Arquivo deletado - Relações desfeitas - ID do plano de vôo: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('flight_plans_error')->error("[Método: Destroy][Controlador: FlightPlanModuleController] - Falha na remoção do plano de vôo - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }
    }
}
