<?php

namespace App\Http\Controllers\Modules\v1\Administration\Users;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelStoreRequest;
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelUpdateRequest;
use App\Services\Modules\Administration\UserPanelService;
use App\Models\Users\User;
use App\Exports\GenericExport;
use App\Http\Resources\Modules\Administration\UsersPanelResource;

class AdministrationModuleUsersController extends Controller
{
    private UserPanelService $service;

    public function __construct(UserPanelService $service)
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
                throw new \Exception("Nenhum usuário encontrado", 404);
            }

            return response(new UsersPanelResource($result), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new User(), $request->limit), 'users.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(UserPanelStoreRequest $request): \Illuminate\Http\Response
    {
        try {
            Gate::authorize('administration_write');

            $this->service->createOne($request->validated());
            return response(["message" => "Usuário criado com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function update(UserPanelUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        try {
            Gate::authorize('administration_write');

            $this->service->updateOne($request->validated(), $id);
            return response(["message" => "Usuário atualizado com sucesso!"], 200);
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
