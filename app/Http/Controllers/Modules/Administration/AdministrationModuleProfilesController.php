<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
// Custom
use App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelStoreRequest;
use App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelUpdateRequest;
use App\Services\Modules\Administration\ProfilePanelService;
use App\Models\Profiles\Profile;
use App\Exports\GenericExport;

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
        return Excel::download(new GenericExport(new Profile(), request()->limit), 'profiles.xlsx');
    }

    public function store(ProfilePanelStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        $this->service->createOne($request->validated());

        return response(["message" => "Perfil criado com sucesso!"], 201);
    }

    public function update(ProfilePanelUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        $this->service->updateOne($request->only(["name", "privileges"]), $id);

        return response(["message" => "Perfil atualizdo com sucesso!"], 200);
    }

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        return $this->service->deleteOne($id);
    }
}
