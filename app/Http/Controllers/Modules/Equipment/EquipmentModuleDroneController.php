<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;
use App\Http\Requests\Modules\Equipments\Drone\StoreDroneRequest;
use App\Http\Requests\Modules\Equipments\Drone\UpdateDroneRequest;
use App\Services\Modules\Equipment\DroneService;
use App\Models\Drones\Drone;
use App\Exports\GenericExport;
use App\Http\Resources\Modules\Equipments\DronesPanelResource;

class EquipmentModuleDroneController extends Controller
{
    private DroneService $service;

    public function __construct(DroneService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_read");

        try {

            $result = $this->service->getPaginate(
                request()->limit,
                request()->page,
                is_null(request()->search) ? "0" : request()->search
            );

            if ($result->total() > 0) {
                return response(new DronesPanelResource($result), 200);
            } else {
                throw new \Exception("Nenhum drone encontrado");
            }
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Drone(), $request->limit), 'baterias.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(StoreDroneRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        try {
            $this->service->createOne($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "image"]));
            return response(["message" => "Drone criado com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function update(UpdateDroneRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        try {
            $this->service->updateOne($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "image"]), $id);
            return response(["message" => "Drone atualizado com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        try {
            $this->service->delete($request->ids);
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }
}
