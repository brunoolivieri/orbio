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
    public function loadPagination(int $limit, int $current_page, int|string $where_value){

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
    
}