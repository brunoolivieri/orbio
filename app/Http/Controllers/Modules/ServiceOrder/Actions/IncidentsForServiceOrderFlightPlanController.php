<?php

namespace App\Http\Controllers\Modules\ServiceOrder\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Modules\Incidents\IncidentRepository;
use App\Http\Resources\Modules\ServiceOrders\IncidentsForServiceOrderFlightPlanResource;

class EquipmentsForServiceOrderFlightPlanController extends Controller
{

    public function __construct(IncidentRepository $repository)
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
        $search = is_null(request()->search) ? "0" : request()->search;
        $page = request()->page;
        $limit = request()->limit;

        $data = $this->repository->getPaginate($limit, $page, $search, []);

        if ($data->total() > 0) {
            return response(new IncidentsForServiceOrderFlightPlanResource($data, (int) request()->service_order_id, (int) request()->flight_plan_id), 200);
        } else {
            return response(["message" => "Nenhum incidente encontrado."], 404);
        }
    }
}
