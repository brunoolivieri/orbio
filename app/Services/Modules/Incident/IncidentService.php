<?php

namespace App\Services\Modules\Incident;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// Custom
use App\Models\Incidents\IncidentModel;
use App\Http\Resources\Modules\Incidents\IncidentsPanelResource;

class IncidentService {

    /**
    * Load all incidents with pagination.
    *
    * @param int $limit
    * @param int $actual_page
    * @param int|string $where_value
    * @return \Illuminate\Http\Response
    */
    public function loadResourceWithPagination(int $limit, int $current_page, int|string $where_value) {

        $data = IncidentModel::where("deleted_at", null)
        ->when($where_value, function ($query, $where_value) {

            $query->where('id', $where_value);

        })->orderBy('id')
        ->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if($data->total() > 0){
            return response(new IncidentsPanelResource($data), 200);
        }else{
            return response(["message" => "Nenhum incidente encontrado."], 404);
        }
    }

    /**
     * Create incident.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request){

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
    public function updateResource(Request $request, int $incident_id) {

        IncidentModel::where('id', $incident_id)->update($request->only(["type", "description", "date"]));

        return response(["message" => "Incidente atualizado com sucesso!"], 200);

    }

    /**
     * Soft delete incident.
     *
     * @param int $incident_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $incident_id) {

        IncidentModel::where('id', $incident_id)->delete();

        return response(["message" => "Incidente deletado com sucesso!"], 200);

    }
    
}