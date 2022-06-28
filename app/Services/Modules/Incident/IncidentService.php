<?php

namespace App\Services\Modules\Incident;

use Illuminate\Support\Facades\DB;
// Custom
use App\Models\Incidents\IncidentModel;
use App\Services\FormatDataService;

class IncidentService{

    private FormatDataService $format_data_service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\FormatDataService $service
     * @param App\Models\Incidents\IncidentModel $incident
     */
    public function __construct(FormatDataService $service){
        $this->format_data_service = $service;
    }

    /**
    * Load all incidents with pagination.
    *
    * @param int $limit
    * @param int $actual_page
    * @param int|string $where_value
    * @return \Illuminate\Http\Response
    */
    public function loadPagination(int $limit, int $current_page, int|string $where_value) {

        $data = DB::table('incidents')
        ->where("incidents.deleted_at", null)
        ->when($where_value, function ($query, $where_value) {

            $query->where('id', $where_value);

        })->orderBy('id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if($data->total() > 0){

            $data_formated = $this->format_data_service->genericDataFormatting($data);

            return response($data_formated, 200);

        }else{

            return response(["error" => "Nenhum incidente encontrado."], 404);

        }
    }

    /**
     * Create incident.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function createIncident(Request $request){

        IncidentModel::create($request->only(["type", "date", "description"]));

        return response(["message" => "Incidente criado com sucesso!"], 200); 

    }

    /**
     * Update incident.
     *
     * @param  \Illuminate\Http\Request $request
     * @param int $incident_id
     * @return \Illuminate\Http\Response
     */
    public function updateIncident(Request $request, int $incident_id) {

        IncidentModel::where('id', $incident_id)->update($request->only(["type", "description", "date"]));

        return response(["message" => "Incidente atualizado com sucesso!"], 200);

    }

    /**
     * Soft delete incident.
     *
     * @param int $incident_id
     * @return \Illuminate\Http\Response
     */
    public function deleteIncident(int $incident_id) {

        IncidentModel::where('id', $incident_id)->delete();

        return response(["message" => "Incidente deletado com sucesso!"], 200);

    }
    
}