<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
// Custom
use App\Models\FlightPlans\FlightPlanModel;
use App\Services\FormatDataService;

class FlightPlanService{

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
    * Load all flight plans with pagination.
    *
    * @param int $limit
    * @param int $actual_page
    * @param int|string $where_value
    * @return \Illuminate\Http\Response
    */
    public function loadPagination(int $limit, int $current_page, int|string $where_value){

        $data = DB::table('flight_plans')
        ->select('id', 'report_id', 'incident_id', 'coordinates', 'description', 'status', 'created_at', 'updated_at', 'deleted_at')
        ->where("flight_plans.deleted_at", null)
        ->when($where_value, function ($query, $where_value) {

            $query->where('id', $where_value);

        })->orderBy('id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if($data->total() > 0){

            $data_formated = $this->format_data_service->genericDataFormatting($data);

            return response($data_formated, 200);

        }else{

            return response(["error" => "Nenhum plano de voo encontrado."], 404);

        }

    }

    /**
     * Download the flight plan file.
     * 
     * @param string $filename
     * @return \Illuminate\Http\Response
     */
    public function getFlightPlanFile(string $filename){

        if(Storage::disk("public")->exists("flight_plans/$filename")){

            $path = Storage::disk("public")->path("flight_plans/$filename");
            $contents = file_get_contents($path); 

            return response($contents)->withHeaders([
                "Content-type" => mime_content_type($path)
            ]);
    
        }else{

            return response(["error" => "Nenhum arquivo encontrado."], 404);

        }

    }

    /**
     * Create flight plan.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createFlightPlan(Request $request){

        if(!$request->file('flight_plan')){
            return response(["error" => "Falha na criação do plano de voo."], 500);
        }

        $coordinantes_filename = $request->flight_plan->getClientOriginalName();
        $coordinantes_folder = "public/flight_plans";

        FlightPlanModel::create([
            "report_id" => null,
            "incident_id" => null,
            "coordinates" => $coordinantes_filename,
            "description" => $request->description,
            "status" => 0
        ]);

        $request->file('flight_plan')->storeAs(
            $coordinantes_folder, $coordinantes_filename
        );

        return response(["message" => "Plano de voo criado com sucesso!"], 200);

    }

    /**
     * Update flight plan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param int $flight_plan_id
     * @return \Illuminate\Http\Response
     */
    public function updateFlightPlan(Request $request, int $flight_plan_id){

        FlightPlanModel::where('id', $id)->update([
            "name" => $request->name,
            "report_id" => $request->report_id == 0 ? null : $request->report_id,
            "incident_id" => $request->incident_id == 0 ? null : $request->incident_id,
            "description" => $request->description,
            "status" => $request->status
        ]);

        return response(["message" => "Plano de voo atualizado com sucesso!"], 200);

    }

    /**
     * Soft delete flight plan.
     *
     * @param int $flight_plan_id
     * @return \Illuminate\Http\Response
     */
    public function deleteFlightPlan(int $flight_plan_id){

        DB::transaction(function() use ($flight_plan_id) {

            $flight_plan = FlightPlanModel::findOrFail($flight_plan_id);

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

            // Delete coordinates file from storage
            Storage::disk('public')->delete("flight_plans/".$flight_plan->coordinates);

            $flight_plan->delete();
            
        });

        return response(["message" => "Plano de voo deletado com sucesso!"], 200);

    }

}