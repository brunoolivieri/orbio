<?php

namespace App\Http\Controllers\v1\Modules\Administration\Profiles;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;
use App\Models\Profiles\Profile;
use App\Http\Requests\v1\Modules\Administration\ProfilePanel\ProfilePanelStoreRequest;
use App\Http\Requests\v1\Modules\Administration\ProfilePanel\ProfilePanelUpdateRequest;
use App\Services\Modules\Administration\ProfilePanelService;
use App\Exports\GenericExport;
use App\Http\Resources\v1\Modules\Administration\ProfilesPaginationResource;

class AdministrationModuleProfilesController extends Controller
{
    private ProfilePanelService $service;

    public function __construct(ProfilePanelService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        try {

            Gate::authorize('administration_read');

            $result = $this->service->getPaginate(
                request()->limit,
                request()->page,
                is_null(request()->search) ? "0" : request()->search
            );

            if ($result->total() == 0) {
                throw new \Exception("Nenhum perfil encontrado", 404);
            }

            return response(new ProfilesPaginationResource($result), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Profile(), $request->limit), 'profiles.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(ProfilePanelStoreRequest $request): \Illuminate\Http\Response
    {
        try {
            Gate::authorize('administration_write');

            $this->service->createOne($request->validated());
            return response(["message" => "Perfil criado com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function update(ProfilePanelUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        try {
            Gate::authorize('administration_write');

            $this->service->updateOne($request->validated(), $id);
            return response(["message" => "Perfil atualizado com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        try {
            Gate::authorize('administration_write');

            $this->service->delete($request->ids);
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
