<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Models\Incidents\Incident;
use App\Models\Pivot\ServiceOrderFlightPlan;
use App\Http\Resources\v1\Modules\ServiceOrders\ServiceOrderIncidentPaginationResource;

class ServiceOrderIncidentController extends Controller
{

    private Incident $model;

    function __construct(Incident $model)
    {
        $this->model = $model;
    }

    public function index(Request $request)
    {
        Gate::authorize('service_orders_read');

        try {

            $limit = request()->limit;
            $page = request()->page;
            $search = is_null(request()->search) ? "0" : request()->search;

            $service_order_flight_plan = ServiceOrderFlightPlan::where("service_order_id", request()->service_order_id)->where("flight_plan_id", request()->flight_plan_id)->first();

            $data = $this->model
                ->where("service_order_flight_plan_id", $service_order_flight_plan->id)
                ->search($search)
                ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));

            if ($data->total() > 0) {
                return response(new ServiceOrderIncidentPaginationResource($data), 200);
            } else {
                throw new \Exception("Nenhum incidente encontrado");
            }
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        Gate::authorize('service_orders_write');

        try {

            $service_order_flight_plan = ServiceOrderFlightPlan::where("service_order_id", $request->serviceOrderId)->where("flight_plan_id", $request->flightPlanId)->first();

            $incident = $this->model->create([
                "type" => $request->type,
                "description" => $request->description,
                "date" => $request->date,
                "service_order_flight_plan_id" => $service_order_flight_plan->id
            ]);

            return response(["message" => "Incidente criado com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $incident_id)
    {
        Gate::authorize('service_orders_write');

        try {
            $incident = $this->model->findOrFail($incident_id);

            $incident->update([
                "type" => $request->type,
                "description" => $request->description,
                "date" => $request->date
            ]);

            return response(["message" => "Incidente atualizado com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request)
    {
        Gate::authorize('service_orders_write');

        try {

            foreach ($request->ids as $incident_id) {
                $incident = $this->model->findOrFail($incident_id);
                $incident->delete();
            }

            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }
}
