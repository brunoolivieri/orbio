<?php

namespace App\Http\Controllers\Modules\FlightPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Exports\GenericExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Requests\Modules\FlightPlans\FlightPlanUpdateRequest;
use App\Services\Modules\FlightPlan\FlightPlanService;
use App\Http\Resources\Modules\FlightPlans\FlightPlansPanelResource;
use App\Models\FlightPlans\FlightPlan;

class FlightPlanModuleController extends Controller
{

    private FlightPlanService $service;

    public function __construct(FlightPlanService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_read');

        try {

            $result = $this->service->getPaginate(
                request()->limit,
                request()->page,
                is_null(request()->search) ? "0" : request()->search
            );

            if ($result->total() == 0) {
                throw new \Exception("Nenhum plano de voo encontrado", 404);
            }

            return response(new FlightPlansPanelResource($result), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new FlightPlan(), $request->limit), 'planos.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        try {
            $this->service->createOne($request->only(["route_files", "imageDataURL", "imageFilename", "csvFile", "coordinates", "timestamp", "type"]));
            return response(["message" => "Plano de voo criado com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function update(FlightPlanUpdateRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        try {
            $this->service->updateOne($request->only(["name", "description", "undelete"]), $id);
            return response(["message" => "Plano de voo atualizado com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        try {
            $this->service->delete($request->ids);
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
