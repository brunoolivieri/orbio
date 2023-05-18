<?php

namespace App\Http\Controllers\v1\Modules\Reports\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Services\Modules\ServiceOrder\ServiceOrderService;
use App\Http\Resources\v1\Modules\ServiceOrders\ServiceOrderReportPaginationResource;

class ServiceOrdersForReport extends Controller
{
    function __construct(ServiceOrderService $service)
    {
        $this->service = $service;
    }

    public function __invoke(Request $request)
    {
        Gate::authorize('service_orders_read');

        $data = $this->service->getPaginate(
            request()->limit,
            request()->page,
            is_null(request()->search) ? "0" : request()->search
        );

        if ($data->total() > 0) {
            return response(new ServiceOrderReportPaginationResource($data), 200);
        } else {
            return response(["message" => "Nenhuma ordem de serviço encontrada."], 404);
        }
    }
}
