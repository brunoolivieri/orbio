<?php

namespace App\Http\Controllers\Modules\v1\ServiceOrders;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderStoreRequest;
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderUpdateRequest;
use App\Services\Modules\ServiceOrder\ServiceOrderService;
use App\Exports\GenericExport;
use App\Models\ServiceOrders\ServiceOrder;
use App\Http\Resources\v1\Modules\ServiceOrders\ServiceOrdersPaginationResource;

class ServiceOrdersModuleController extends Controller
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

            if ($result->total() == 0) {
                throw new \Exception("Nenhuma ordem de serviço encontrada", 404);
            }

            return response(new ServiceOrdersPaginationResource($result), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
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
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function update(ServiceOrderUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        try {
            $this->service->updateOne($request->only(["start_date", "end_date", "pilot_id", "status", "creator_id", "client_id", "observation", "number", "flight_plans", "undelete"]), $id);
            return response(["message" => "Ordem de serviço atualizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        try {
            $this->service->delete($request->ids);
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
