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

    /**
     * Dependency injection.
     * 
     * @param App\Models\Batteries\Battery $battery
     */
    public function __construct(BatteryService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_read");

        return $this->service->loadResourceWithPagination(
            request()->limit,
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param App\Http\Requests\Modules\Equipments\Battery\StoreBatteryRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreBatteryRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->createResource($request);
    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_read");

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\Equipments\Battery\UpdateBatteryRequest  $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateBatteryRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->updateResource($request, $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize("equipments_write");

        return $this->service->deleteResource($id);
    }
}
