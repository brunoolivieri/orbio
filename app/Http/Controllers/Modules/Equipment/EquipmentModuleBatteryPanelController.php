<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;
// Custom
use App\Http\Requests\Modules\Equipments\Battery\StoreBatteryRequest;
use App\Http\Requests\Modules\Equipments\Battery\UpdateBatteryRequest;
use App\Services\Modules\Equipment\BatteryService;
use App\Models\Batteries\Battery;
use App\Exports\GenericExport;

class EquipmentModuleBatteryPanelController extends Controller
{

    private BatteryService $service;

    public function __construct(BatteryService $service)
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
        return Excel::download(new GenericExport(new Battery(), $request->limit), 'baterias.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(StoreBatteryRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->createOne($request->only(["name", "manufacturer", "model", "serial_number", "last_charge", "image"]));
    }

    public function update(UpdateBatteryRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->updateOne($request->only(["name", "manufacturer", "model", "serial_number", "last_charge", "image"]), $id);
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->delete($request->ids);
    }
}
