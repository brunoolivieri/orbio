<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;
// Custom
use App\Http\Requests\Modules\Equipments\Drone\StoreDroneRequest;
use App\Http\Requests\Modules\Equipments\Drone\UpdateDroneRequest;
use App\Services\Modules\Equipment\DroneService;
use App\Models\Drones\Drone;
use App\Exports\GenericExport;

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

        return $this->service->getPaginate(
            request()->limit,
            request()->page,
            is_null(request()->search) ? "0" : request()->search
        );
    }

    public function exportAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Drone(), $request->limit), 'baterias.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(StoreDroneRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->createOne($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "image"]));
    }

    public function update(UpdateDroneRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->updateOne($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "image"]), $id);
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->delete($request->ids);
    }
}
