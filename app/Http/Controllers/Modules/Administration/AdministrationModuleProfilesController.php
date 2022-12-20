<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;
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
            request()->page,
            is_null(request()->search) ? "0" : request()->search
        );
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean(); 
        ob_start(); 
        return Excel::download(new GenericExport(new Profile(), $request->limit), 'profiles.xlsx', \Maatwebsite\Excel\Excel::XLSX);
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

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        return $this->service->delete($request->ids);
    }
}
