<?php

namespace App\Http\Controllers\Modules\v1\ServiceOrders\Actions;

use App\Http\Controllers\Controller;
use App\Repositories\Modules\FlightPlans\FlightPlanRepository;
use App\Http\Resources\v1\Modules\ServiceOrders\FlightPlansForServiceOrderPaginationResource;

class FlightPlansForServiceOrderController extends Controller
{

    function __construct(FlightPlanRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke(): \Illuminate\Http\Response
    {
        $search = is_null(request()->search) ? "0" : request()->search;
        $page = request()->page;
        $limit = request()->limit;
        $service_order_id = isset(request()->service_order_id) ? request()->service_order_id : null;

        $data = $this->repository->getPaginate($limit, $page, $search, []);

        if ($data->total() > 0) {
            return response(new FlightPlansForServiceOrderPaginationResource($data, $service_order_id), 200);
        } else {
            return response(["message" => "Nenhum plano de voo encontrado."], 404);
        }
    }
}
