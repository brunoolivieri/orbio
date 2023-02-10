<?php

namespace App\Http\Controllers\Modules\ServiceOrder\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\Modules\ServiceOrders\ServiceOrderIncidentResource;
use App\Models\Incidents\Incident;
use App\Models\Pivot\ServiceOrderFlightPlan;

class ServiceOrderIncidentController extends Controller
{

    private Incident $model;

    function __construct(Incident $model)
    {
        $this->model = $model;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Gate::authorize('service_orders_read');

        $limit = request()->limit;
        $page = request()->page;
        $search = is_null(request()->search) ? "0" : request()->search;

        $service_order_flight_plan = ServiceOrderFlightPlan::where("service_order_id", request()->service_order_id)->where("flight_plan_id", request()->flight_plan_id)->first();

        $data = $this->model
            ->where("service_order_flight_plan_id", $service_order_flight_plan->id)
            ->search($search)
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));

        if ($data->total() > 0) {
            return response(new ServiceOrderIncidentResource($data), 200);
        } else {
            return response(["message" => "Nenhum incidente encontrado"], 404);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Gate::authorize('service_orders_write');

        $service_order_flight_plan = ServiceOrderFlightPlan::where("service_order_id", request()->service_order_id)->where("flight_plan_id", request()->flight_plan_id)->first();

        $incident = $this->model->create([
            "type" => $request->type,
            "description" => $request->description,
            "date" => $request->date,
            "service_order_flight_plan_id" => $service_order_flight_plan->id
        ]);

        return response(["message" => "Incidente criado com sucesso!"], 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $incident_id)
    {
        Gate::authorize('service_orders_write');

        $incident = $this->model->findOrFail($incident_id);

        $incident->update([
            "type" => $request->type,
            "description" => $request->description,
            "date" => $request->date
        ]);

        return response(["message" => "Incidente atualizado com sucesso!"], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($incident_id)
    {
        Gate::authorize('service_orders_write');

        $incident = $this->model->findOrFail($incident_id);

        $incident->delete();

        return response(["message" => "Incidente deletado com sucesso!"], 200);
    }
}
