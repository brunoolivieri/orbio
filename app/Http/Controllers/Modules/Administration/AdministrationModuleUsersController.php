<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;
// Custom
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelStoreRequest;
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelUpdateRequest;
use App\Services\Modules\Administration\UserPanelService;
use App\Models\Users\User;
use App\Exports\GenericExport;

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

        return $this->service->getPaginate(
            request()->limit,
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter === "0" ? [] : request()->filter
        );
    }

    public function exportAsCsv(Request $request)
    {
        ob_end_clean(); 
        ob_start(); 
        return Excel::download(new GenericExport(new User(), $request->limit), 'users.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(UserPanelStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        return $this->service->createOne($request->validated());
    }

    public function update(UserPanelUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        return $this->service->updateOne($request->validated(), $id);
    }

    public function destroy($id): \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        return $this->service->deleteOne($id);
    }
}
