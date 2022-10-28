<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Service
use App\Services\Modules\ServiceOrder\ServiceOrderService;
// Resource
use App\Http\Resources\Modules\ServiceOrders\ServiceOrderReportResource;

class LoadServiceOrderForReport extends Controller
{
    function __construct(ServiceOrderService $service)
    {
        $this->service = $service;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        Gate::authorize('service_orders_read');
       
        $data = $this->service->loadResourceWithPagination(
            request()->limit,
            request()->order_by,
            request()->page,
            is_null(request()->search) ? "0" : request()->search,
            request()->filter === "0" ? [] : request()->filter
        );

        if ($data->total() > 0) {
            return response(new ServiceOrderReportResource($data), 200);
        } else {
            return response(["message" => "Nenhuma ordem de serviço encontrada."], 404);
        }
    }
}
