<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Http\Requests\Modules\Equipments\Drone\StoreDroneRequest;
use App\Http\Requests\Modules\Equipments\Drone\UpdateDroneRequest;
use App\Services\Modules\Equipment\DroneService;

class EquipmentModuleDronePanelController extends Controller
{

    private DroneService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Models\Drones\DroneModel $drone
     */
    public function __construct(DroneService $service){
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_read");

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        return $this->service->loadDronesWithPagination($limit, $actual_page, $where_value);
            
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param App\Http\Requests\Modules\Equipments\Drone\StoreDroneRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreDroneRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->createDrone($request);
 
    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_read");

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];
            
        return $this->service->loadDronesWithPagination($limit, $actual_page, $where_value);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\Equipments\Drone\UpdateDroneRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateDroneRequest $request, $id) : \Illuminate\Http\Response
    {

        Gate::authorize("equipments_write");

        return $this->service->updateDrone($request, $id);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->deleteDrone($id);

    }
}
