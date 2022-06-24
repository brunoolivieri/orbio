<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Http\Requests\Modules\Equipments\Battery\StoreBatteryRequest;
use App\Http\Requests\Modules\Equipments\Battery\UpdateBatteryRequest;
use App\Services\Modules\Equipment\BatteryService;

class EquipmentModuleBatteryPanelController extends Controller
{

    private BatteryService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Models\Batteries\BatteryModel $battery
     */
    public function __construct(BatteryService $service){
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
     * @param App\Http\Requests\Modules\Equipments\Battery\StoreBatteryRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreBatteryRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->createBattery($request); 

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
            
        return $this->service->loadPagination($limit, $actual_page, $where_value);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\Equipments\Battery\UpdateBatteryRequest  $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateBatteryRequest $request, $id) : \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->updateBattery($request, $id);
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

        return $this->deleteBattery($id);

    }
}
