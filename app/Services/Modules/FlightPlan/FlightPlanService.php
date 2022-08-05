<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
// Custom
use App\Models\FlightPlans\FlightPlanModel;
use App\Http\Resources\Modules\FlightPlans\FlightPlansPanelResource;

class FlightPlanService {

    private FormatDataService $format_data_service;

    /**
    * Load all flight plans with pagination.
    *
    * @param int $limit
    * @param int $actual_page
    * @param int|string $typed_search
    * @return \Illuminate\Http\Response
    */
    public function loadResourceWithPagination(int $limit, int $current_page, int|string $typed_search){

        $data = FlightPlanModel::where("deleted_at", null)
        ->with("incidents")
        ->with("reports")
        ->when($typed_search, function ($query, $typed_search) {

            $query->when(is_numeric($typed_search), function($query) use ($typed_search){

                $query->where('id', $typed_search);

            }, function($query) use ($typed_search){

                $query->where('name', 'LIKE', '%'.$typed_search.'%');

            });

        })
        ->orderBy('id')
        ->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if($data->total() > 0){
            return response(new FlightPlansPanelResource($data), 200);
        }else{
            return response(["message" => "Nenhum plano de voo encontrado."], 404);
        }

    }

    /**
     * Download the flight plan file.
     * 
     * @param string $filename
     * @return \Illuminate\Http\Response
     */
    public function downloadResource(string $filename){

        if(Storage::disk("public")->exists("flight_plans/$filename")){

            $path = Storage::disk("public")->path("flight_plans/$filename");
            $contents = file_get_contents($path); 

            return response($contents)->withHeaders([
                "Content-type" => mime_content_type($path)
            ]);
    
        }else{

            return response(["message" => "Nenhum arquivo encontrado."], 404);

        }

    }

    /**
     * Create flight plan.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request){

        if(!$request->file("coordinates_file")){
            return response(["message" => "Falha na criação do plano de voo."], 500);
        }

        // Filename is the hash of the content
        $file_content_hash = md5(file_get_contents($request->file("coordinates_file"))); 
        $filename = $file_content_hash.".txt";
        $storage_folder = "public/flight_plans";

        FlightPlanModel::create([
            "report_id" => null,
            "incident_id" => null,
            "name" => $request->name,
            "coordinates_file" => $filename,
            "description" => $request->description == "none" ? "N/A" : $request->description,
            "status" => 0
        ]);

        // Flight plan is stored just if does not already exists
        if (!Storage::disk('public')->exists($storage_folder.$filename)) {
            $path = $request->file('coordinates_file')->storeAs($storage_folder, $filename);
        }

        return response(["message" => "Plano de voo criado com sucesso!"], 200);

    }

    /**
     * Update flight plan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param int $flight_plan_id
     * @return \Illuminate\Http\Response
     */
    public function updateResource(Request $request, int $flight_plan_id){

        FlightPlanModel::where('id', $flight_plan_id)->update([
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
    public function deleteResource(int $flight_plan_id){

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

            // Delete coordinates_file file from storage
            Storage::disk('public')->delete("flight_plans/".$flight_plan->coordinates_file);

            $flight_plan->delete();
            
        });

        return response(["message" => "Plano de voo deletado com sucesso!"], 200);

    }

}