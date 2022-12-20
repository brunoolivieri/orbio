<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;
// Custom
use App\Http\Requests\Modules\Equipments\Equipment\StoreEquipmentRequest;
use App\Http\Requests\Modules\Equipments\Equipment\UpdateEquipmentRequest;
use App\Services\Modules\Equipment\EquipmentService;
use App\Models\Equipments\Equipment;
use App\Exports\GenericExport;

class EquipmentModuleEquipmentPanelController extends Controller
{

    private EquipmentService $service;

    public function __construct(EquipmentService $service)
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

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Equipment(), $request->limit), 'baterias.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(StoreEquipmentRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->createOne($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date", "image"]));
    }

    public function update(UpdateEquipmentRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->updateOne($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date", "image"]), $id);
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->delete($request->ids);
    }
}
