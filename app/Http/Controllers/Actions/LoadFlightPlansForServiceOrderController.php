<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Models
use App\Models\FlightPlans\FlightPlan;
// Resource
use App\Http\Resources\Modules\ServiceOrders\ServiceOrdersFlightPlansResource;

class LoadFlightPlansForServiceOrderController extends Controller
{
    function __construct(FlightPlan $flightPlanModel)
    {
        $this->flightPlanModel = $flightPlanModel;
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

        $data = $this->flightPlanModel->with("incident")
            ->with("service_orders")
            ->search($search) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);

        return response(new ServiceOrdersFlightPlansResource($data, $service_order_id), 200);

    }
}
