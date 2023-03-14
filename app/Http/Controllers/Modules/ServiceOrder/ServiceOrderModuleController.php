<?php

namespace App\Http\Controllers\Modules\ServiceOrder;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
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

        try {

            $result = $this->service->getPaginate(
                request()->limit,
                request()->page,
                is_null(request()->search) ? "0" : request()->search
            );

            if ($result->total() > 0) {
                return response(new ServiceOrdersPanelResource($result), 200);
            } else {
                throw new \Exception("Nenhuma ordem de serviço encontrada");
            }
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new ServiceOrder(), $request->limit), 'ordens_de_servico.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(ServiceOrderStoreRequest $request): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        try {
            $this->service->createOne($request->only(["start_date", "end_date", "pilot_id", "client_id", "observation", "number", "flight_plans"]));
            return response(["message" => "Ordem de serviço criada com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function update(ServiceOrderUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        try {
            $this->service->updateOne($request->only(["start_date", "end_date", "pilot_id", "status", "creator_id", "client_id", "observation", "number", "flight_plans", "undelete"]), $id);
            return response(["message" => "Ordem de serviço atualizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        try {
            $this->service->delete($request->ids);
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }
}
