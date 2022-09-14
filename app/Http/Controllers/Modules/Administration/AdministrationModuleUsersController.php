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

    public function __construct(UserPanelService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        Gate::authorize('administration_read');

        return $this->service->loadResourceWithPagination(
            request()->limit,
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter === "0" ? [] : request()->filter
        );
    }

    public function store(UserPanelStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        return $this->service->createResource($request->validated());
    }

    public function show()
    {
        Gate::authorize('administration_read');
        //
    }

    public function update(UserPanelUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        return $this->service->updateResource($request->validated(), $id);
    }

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        return $this->service->deleteResource($id);
    }
}
