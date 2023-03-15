<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;
use App\Http\Requests\Modules\Equipments\Battery\StoreBatteryRequest;
use App\Http\Requests\Modules\Equipments\Battery\UpdateBatteryRequest;
use App\Services\Modules\Equipment\BatteryService;
use App\Models\Batteries\Battery;
use App\Exports\GenericExport;
use App\Http\Resources\Modules\Equipments\BatteriesPanelResource;

class EquipmentModuleBatteryController extends Controller
{
    private BatteryService $service;

    public function __construct(BatteryService $service)
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
                return response(new BatteriesPanelResource($result), 200);
            } else {
                throw new \Exception("Nenhuma bateria encontrada");
            }
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Battery(), $request->limit), 'baterias.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(StoreBatteryRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        try {
            $this->service->createOne($request->only(["name", "manufacturer", "model", "serial_number", "last_charge", "observation", "image"]));
            return response(["message" => "Bateria criada com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function update(UpdateBatteryRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        try {
            $this->service->updateOne($request->only(["name", "manufacturer", "model", "serial_number", "last_charge", "observation", "image", "undelete"]), $id);
            return response(["message" => "Bateria atualizada com sucesso!"], 200);
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
