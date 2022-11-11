<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Http\Requests\Modules\Equipments\Battery\StoreBatteryRequest;
use App\Http\Requests\Modules\Equipments\Battery\UpdateBatteryRequest;
use App\Services\Modules\Equipment\BatteryService;

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
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter === "0" ? [] : request()->filter
        );
    }

    public function exportAsCsv()
    {
        dd(request()->limit);
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

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->deleteOne($id);
    }
}
