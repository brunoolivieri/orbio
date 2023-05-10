<?php

namespace App\Http\Controllers\Modules\v1\ServiceOrders\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Modules\FlightPlans\FlightPlanLogRepository;
use App\Http\Resources\v1\Modules\ServiceOrders\LogsForServiceOrderFlightPlanPaginationResource;

class LogsForServiceOrderFlightPlanController extends Controller
{
    function __construct(FlightPlanLogRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke(Request $request)
    {
        $search = is_null(request()->search) ? "0" : request()->search;
        $page = request()->page;
        $limit = request()->limit;

        $data = $this->repository->getPaginate($limit, $page, $search, []);

        if ($data->total() > 0) {
            return response(new LogsForServiceOrderFlightPlanPaginationResource($data, (int) request()->service_order_id, (int) request()->flight_plan_id), 200);
        } else {
            return response(["message" => "Nenhum plano de voo encontrado."], 404);
        }
    }
}
