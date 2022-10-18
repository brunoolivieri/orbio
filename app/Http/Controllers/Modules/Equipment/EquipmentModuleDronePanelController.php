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

    public function __construct(DroneService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_read");

        return $this->service->loadResourceWithPagination(
            request()->limit,
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter === "0" ? [] : request()->filter
        );
    }

    public function store(StoreDroneRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");
        
        return $this->service->createResource($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "image"]));
    }

    public function show($id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_read");

        //
    }

    public function update(UpdateDroneRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->updateResource($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "image"]), $id);
    }

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->deleteResource($id);
    }
}
