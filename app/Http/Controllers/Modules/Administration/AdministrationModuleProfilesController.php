<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
// Form Request
use App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelStoreRequest;
use App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelUpdateRequest;
// Services
use App\Services\Modules\Administration\ProfilePanelService;

class AdministrationModuleProfilesController extends Controller
{
    private ProfilePanelService $service;

    /**
     * Dependency injection.
     * 
     * @param  App\Services\Administration\ProfilePanelService $service
     */
    public function __construct(ProfilePanelService $service)
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
     * @param App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelStoreRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProfilePanelStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

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
        Gate::authorize('administration_read');

        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelUpdateRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(ProfilePanelUpdateRequest $request, $id): \Illuminate\Http\Response
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
