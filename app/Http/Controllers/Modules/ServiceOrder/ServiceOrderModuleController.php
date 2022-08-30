<?php

namespace App\Http\Controllers\Modules\ServiceOrder;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderStoreRequest;
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderUpdateRequest;
use App\Services\Modules\ServiceOrder\ServiceOrderService;

class ServiceOrderModuleController extends Controller
{

    private ServiceOrderService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\Modules\ServiceOrder\ServiceOrderService $service
     */
    public function __construct(ServiceOrderService $service)
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
        Gate::authorize('service_orders_read');

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
     * @param App\Http\Requests\Modules\ServiceOrders\ServiceOrderStoreRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(ServiceOrderStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        return $this->service->createResource($request->validated());
    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_read');

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\ServiceOrders\ServiceOrderUpdateRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(ServiceOrderUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        return $this->service->updateResource($request->validated(), $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        return $this->service->deleteResource($id);
    }
}
