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

        $response = $model->loadFlightPlansWithPagination($limit, $actual_page, $where_value);

        if($response["status"] && !$response["error"]){
    
            $data_formated = $this->flightPlansTableFormat($response["data"], $limit);

            return response($data_formated, 200);

        }else if(!$response["status"] && $response["error"]){

            return response(["status" => false, "error" => $response->content()], 500);

        }  
    }

    /**
     * Data is formated for the frontend plans table
     *
     * @param object $data
     * @return array
     */
    private function flightPlansTableFormat(LengthAwarePaginator $data) : array {

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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() : \Illuminate\Http\Response
    {
        try{

            $table = request()->data_source;

            $data = DB::table($table)->get();

            return response($data, 200);

        }catch(\Exception $e){

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
            $storage_folder = "flight_plans";

            FlightPlansModel::create([
                "id_relatorio" => null,
                "id_incidente" => null,
                "arquivo" => $file_name,
                "descricao" => $request->description,
                "status" => 0
            ]);

            $path = $request->file('flight_plan')->storeAs(
                $storage_folder, $file_name
            );

            return response("", 200);

        }catch(\Exception $e){

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

        $response = $model->loadFlightPlansWithPagination($limit, $actual_page, $where_value);

        if($response["status"] && !$response["error"]){
    
            $data_formated = $this->flightPlansTableFormat($response["data"], $limit);

            return response($data_formated, 200);

        }else if(!$response["status"] && $response["error"]){

            return response(["status" => false, "error" => $response->content()], 500);

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

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 200);

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

            FlightPlansModel::where('id', $id)->delete();

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);

        }
    }
}
