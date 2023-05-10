<?php

namespace App\Http\Controllers\Modules\v1\Equipments\OtherEquipments;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;
use App\Http\Requests\Modules\Equipments\Equipment\StoreEquipmentRequest;
use App\Http\Requests\Modules\Equipments\Equipment\UpdateEquipmentRequest;
use App\Services\Modules\Equipment\EquipmentService;
use App\Models\Equipments\Equipment;
use App\Exports\GenericExport;
use App\Http\Resources\v1\Modules\Equipments\EquipmentsPaginationResource;

class EquipmentModuleEquipmentController extends Controller
{
    private EquipmentService $service;

    public function __construct(EquipmentService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        try {

            Gate::authorize("equipments_read");

            $result = $this->service->getPaginate(
                request()->limit,
                request()->page,
                is_null(request()->search) ? "0" : request()->search
            );

            if ($result->total() == 0) {
                throw new \Exception("Nenhum equipamento encontrado", 404);
            }

            return response(new EquipmentsPaginationResource($result), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Equipment(), $request->limit), 'baterias.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(StoreEquipmentRequest $request): \Illuminate\Http\Response
    {
        try {
            Gate::authorize("equipments_write");

            $this->service->createOne($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date", "image"]));
            return response(["message" => "Bateria criada com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function update(UpdateEquipmentRequest $request, $id): \Illuminate\Http\Response
    {
        try {
            Gate::authorize("equipments_write");

            $this->service->updateOne($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date", "image", "undelete"]), $id);
            return response(["message" => "Bateria atualizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        try {
            Gate::authorize("equipments_write");

            $this->service->delete($request->ids);
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }
}
