<?php

namespace App\Http\Controllers\Modules\FlightPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Exception;
use App\Services\Modules\FlightPlan\FlightPlanLogService;
use App\Http\Requests\Modules\FlightPlans\Logs\UpdateLogRequest;
use App\Exports\GenericExport;
use App\Models\Logs\Log;
use App\Http\Resources\Modules\FlightPlans\FlightPlansLogPanelResource;

class FlightPlanModuleLogController extends Controller
{

    private FlightPlanLogService $service;

    public function __construct(FlightPlanLogService $service)
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

            if ($result->total() > 0) {
                return response(new FlightPlansLogPanelResource($result), 200);
            } else {
                throw new Exception("Nenhum log encontrado");
            }
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Log(), $request->limit), 'logs.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function downloadLog(string $filename): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_read');

        try {
            return $this->service->download($filename);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');
        dd($request->all());
        try {
            $this->service->createOne([
                "logs" => $request->file('files'),
                "images" => $request->file('images')
            ]);
            return response(["message" => "Log criado com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function update(UpdateLogRequest $request, $id): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        try {
            $result = $this->service->updateOne($request->only(["name", "service_order_id"]), $id);
            return response(["message" => "Log atualizado com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        Gate::authorize('flight_plans_write');

        try {
            $result = $this->service->delete($request->ids);
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }
}
