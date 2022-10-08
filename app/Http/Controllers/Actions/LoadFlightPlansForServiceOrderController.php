<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Models
use App\Models\FlightPlans\FlightPlan;
// Resource
use App\Http\Resources\Modules\ServiceOrders\ServiceOrdersFlightPlansResource;
// Repository
use App\Repositories\Modules\FlightPlans\FlightPlanRepository;

class LoadFlightPlansForServiceOrderController extends Controller
{
    function __construct(FlightPlanRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        Gate::authorize('flight_plans_read');

        $search = is_null(request()->search) ? "0" : request()->search;
        $page_number = request()->page;
        $limit = request()->limit;
        $order_by = request()->order_by;
        $service_order_id = isset(request()->service_order) ? request()->service_order : null;

        $data = $this->repository->getPaginate($limit, $order_by, $page_number, $search, []);

        if ($data->total() > 0) {
            return response(new ServiceOrdersFlightPlansResource($data, $service_order_id), 200);
        } else {
            return response(["message" => "Nenhum plano de voo encontrado."], 404);
        }
    }
}
