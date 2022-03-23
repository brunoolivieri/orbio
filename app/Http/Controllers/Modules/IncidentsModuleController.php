<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Model utilizado
use App\Models\Incidents\IncidentsModel;

class IncidentsModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        $model = new IncidentsModel();

        $request_values = explode("/", request()->args);

        $offset = $request_values[0];
        $limit = $request_values[1];

        $response = $model->loadAllIncidents((int) $offset, (int) $limit);

        if($response["status"] && !$response["error"]){
    
            $dataFormated = $this->plansTableFormat($response["data"], $limit);

            return response(["status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$response["status"] && $response["error"]){

            return response(["status" => false, "error" => $response->content()], 500);

        }  

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
        $model = new IncidentsModel();

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        $model = new IncidentsModel();

        $registrationData = [
    
        ];

        $response = $model->newIncident($registrationData);

         if($response["status"]){

            return response(["status" => $response["status"], "error" => $response["error"]], 200);

        }else{

            return response(["status" => $response["status"], "error" => $response["error"]], 500);

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
        
        $model = new IncidentsModel();

        $request_values = explode(".", request()->args);

        $value_searched = $request_values[0];
        $offset = $request_values[1];
        $limit = $request_values[2];

        $response = $model->loadSpecificIncidents($value_searched, (int) $offset, (int) $limit);
    
        if($response["status"] && !$response["error"]){

            $dataFormated = $this->incidentsTableFormat($response["data"], $limit);

            return array("status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]);

        }else if(!$response["status"] && $response["error"]){

            return array("status" => false, "error" => $response["error"]);

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
    public function update(Request $request, $id)
    {
        
        $model = new IncidentsModel();

        $updateData = [
            
        ];

        $update = $model->updateIncident((int) $request->id, $updateData);

        if($update["status"] && !$update["error"]){

            return response("", 200);

        }else if(!$update["status"] && $update["error"]){

            return response(["error" => $update["error"]], 500);

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
        
        $model = new IncidentsModel();

    }
}
