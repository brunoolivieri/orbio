<?php

namespace App\Http\Controllers\Modules\FlightPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
// Custom
use App\Models\FlightPlans\FlightPlanModel;
use App\Http\Requests\Modules\FlightPlans\FlightPlanStoreRequest;
use App\Http\Requests\Modules\FlightPlans\FlightPlanUpdateRequest;
use App\Services\FormatDataService;

class FlightPlanModuleController extends Controller
{

    private FormatDataService $format_data_service;
    private FlightPlanModel $flight_plan_model;

    /**
     * Dependency injection.
     * 
     * @param App\Services\FormatDataService $service
     * @param App\Models\FlightPlans\FlightPlanModel $flight_plan
     */
    public function __construct(FormatDataService $service, FlightPlanModel $flight_plan){
        $this->format_data_service = $service;
        $this->flight_plan_model = $flight_plan;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model_response = $this->flight_plan_model->loadFlightPlansWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            if($model_response["data"]->total() > 0){

                $data_formated = $this->format_data_service->genericDataFormatting($model_response["data"]);

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
     * Download the flight plan file
     * @param string $filename
     * @return \Illuminate\Http\Response
     */
    public function getFlightPlanFile(string $filename) : \Illuminate\Http\Response {

        Gate::authorize('flight_plans_read');

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
        Gate::authorize('flight_plans_write');

        try{

            $file_name = $request->flight_plan->getClientOriginalName();
            $storage_folder = "public/flight_plans";

            FlightPlanModel::create([
                "report_id" => null,
                "incident_id" => null,
                "file" => $file_name,
                "description" => $request->description,
                "status" => 0
            ]);

            if($request->file('flight_plan')){

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
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) : \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model_response = $this->flight_plan_model->loadFlightPlansWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
    
            if($model_response["data"]->total() > 0){

                $data_formated = $this->format_data_service->genericDataFormatting($model_response["data"]);

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
     * @param App\Http\Requests\Modules\FlightPlans\FlightPlanUpdateRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(FlightPlanUpdateRequest $request, $id) : \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        try{

            FlightPlanModel::where('id', $id)->update([
                "report_id" => $request->report_id == 0 ? null : $request->report_id,
                "incident_id" => $request->incident_id == 0 ? null : $request->incident_id,
                "description" => $request->description,
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
        Gate::authorize('flight_plans_write');

        try{

            DB::BeginTransaction();

            $flight_plan = FlightPlanModel::find($id);

            // Desvinculation with incidents table
            if(!empty($flight_plan->incidents)){ 
                $flight_plan->incidents()->delete();
            }

            // Desvinculation with reports table
            if(!empty($flight_plan->reports)){
                $flight_plan->reports()->delete();
            }
            
            // Desvinculations with service_orders through service_orders_has_flight_plans table
            if(!empty($flight_plan->service_order_has_flight_plans)){
                $flight_plan->service_order_has_flight_plans()->delete();
            }

            // Delete file from storage
            Storage::disk('public')->delete("flight_plans/".$flight_plan->arquivo);

            $flight_plan->delete();

            Log::channel('flight_plans_action')->info("[Método: Destroy][Controlador: FlightPlanModuleController] - Plano de vôo removido com sucesso - Incidentes e relatórios relacionados foram deletados - Arquivo 'flight_plans/".$flight_plan->file." deletado - ID do plano de vôo: ".$id);

            DB::Commit();

            return response("", 200);

        }catch(\Exception $e){

            DB::rollBack();

            Log::channel('flight_plans_error')->error("[Método: Destroy][Controlador: FlightPlanModuleController] - Falha na remoção do plano de vôo - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }
    }
}
