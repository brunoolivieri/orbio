<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
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
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter === "0" ? [] : request()->filter
        );
    }

    public function exportAsCsv()
    {
        $response = Excel::download(new GenericExport(new Equipment(), request()->limit), 'equipamentos.csv', \Maatwebsite\Excel\Excel::CSV);
        ob_end_clean();

        return $response;
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

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->deleteOne($id);
    }
}
