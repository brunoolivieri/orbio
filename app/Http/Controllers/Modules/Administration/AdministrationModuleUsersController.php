<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelStoreRequest;
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelUpdateRequest;
use App\Services\Modules\Administration\UserPanelService;

class AdministrationModuleUsersController extends Controller
{
    private UserPanelService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\Modules\Administration\UserPanelService $service
     */
    public function __construct(UserPanelService $service)
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

        Gate::authorize('administration_read');

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
     * @param App\Http\Requests\Modules\Administration\UserPanel\UserPanelUpdateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserPanelStoreRequest $request): \Illuminate\Http\Response
    {

        Gate::authorize('administration_write');

        return $this->service->createResource($request);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(): \Illuminate\Http\Response
    {

        Gate::authorize('administration_read');

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\Administration\UserPanel\UserPanelStoreRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserPanelUpdateRequest $request, $id): \Illuminate\Http\Response
    {

        Gate::authorize('administration_write');

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

        Gate::authorize('administration_write');

        return $this->service->deleteResource($id);
    }
}
