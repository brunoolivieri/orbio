<?php

namespace App\Http\Controllers\Modules\Equipment;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Http\Requests\Modules\Equipments\Equipment\StoreEquipmentRequest;
use App\Http\Requests\Modules\Equipments\Equipment\UpdateEquipmentRequest;
use App\Services\Modules\Equipment\EquipmentService;

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

        return $this->service->loadResourceWithPagination(
            request()->limit,
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter === "0" ? [] : request()->filter
        );
    }

    public function store(StoreEquipmentRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->createResource($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date", "image"]));
    }

    public function update(UpdateEquipmentRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->updateResource($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date", "image"]), $id);
    }

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->deleteResource($id);
    }
}
