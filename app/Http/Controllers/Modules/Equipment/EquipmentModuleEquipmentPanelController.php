<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Http\Requests\Modules\Equipments\Equipment\StoreEquipmentRequest;
use App\Http\Requests\Modules\Equipments\Equipment\UpdateEquipmentRequest;
use App\Services\Modules\Equipment\EquipmentService;

class EquipmentModuleEquipmentPanelController extends Controller
{

    private EquipmentService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Models\Equipments\EquipmentModel $equipment
     */
    public function __construct(EquipmentService $service){
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

        return $this->service->loadPagination($limit, $actual_page, $where_value);
            
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param App\Http\Requests\Modules\Equipments\Equipment\StoreEquipmentRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreEquipmentRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->createEquipment($request);
   
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
            
        $model_response =  $this->equipment_model->loadEquipmentsWithPagination($limit, $actual_page, $where_value);

        return $this->service->loadPagination($limit, $actual_page, $where_value);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\Equipments\Equipment\UpdateEquipmentRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateEquipmentRequest $request, $id) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->updateEquipment($request, $id);

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

        return $this->service->deleteEquipment($id);

    }
}
