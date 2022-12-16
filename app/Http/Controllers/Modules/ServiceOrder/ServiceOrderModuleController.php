<?php

namespace App\Http\Controllers\Modules\ServiceOrder;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
// Custom
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderStoreRequest;
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderUpdateRequest;
use App\Services\Modules\ServiceOrder\ServiceOrderService;
use App\Http\Resources\Modules\ServiceOrders\ServiceOrdersPanelResource;
use App\Exports\GenericExport;
use App\Models\ServiceOrders\ServiceOrder;

class ServiceOrderModuleController extends Controller
{

    private ServiceOrderService $service;

    public function __construct(ServiceOrderService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_read');

        $data = $this->service->getPaginate(
            request()->limit,
            request()->page,
            is_null(request()->search) ? "0" : request()->search
        );

        if ($data->total() > 0) {
            return response(new ServiceOrdersPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhuma ordem de serviço encontrada."], 404);
        }
    }

    public function exportAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new ServiceOrder(), $request->limit), 'ordens_de_servico.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(ServiceOrderStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        return $this->service->createOne($request->only(["start_date", "end_date", "pilot_id", "client_id", "observation", "status", "number", "flight_plans"]));
    }

    public function update(ServiceOrderUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');
        //dd($request->only(["start_date", "end_date", "pilot_id", "creator_id", "client_id", "observation", "status", "number", "flight_plans"]));
        return $this->service->updateOne($request->only(["start_date", "end_date", "pilot_id", "creator_id", "client_id", "observation", "status", "number", "flight_plans"]), $id);
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');
      
        return $this->service->delete($request->ids);
    }
}
