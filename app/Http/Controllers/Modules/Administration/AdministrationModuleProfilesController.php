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

    public function __construct(ProfilePanelService $service)
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

    public function store(ProfilePanelStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        $this->service->createResource($request->validated());

        return response(["message" => "Perfil criado com sucesso!"], 201);
    }

    public function show($id)
    {
        Gate::authorize('administration_read');
        //
    }

    public function update(ProfilePanelUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        $this->service->updateResource($request->validated(), $id);

        return response(["message" => "Perfil atualizdo com sucesso!"], 200);
    }

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        $this->service->deleteResource($id);

        response(["message" => "Perfil deletado com sucesso!"], 200);
    }
}
