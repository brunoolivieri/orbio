<?php

namespace App\Http\Controllers\Modules\v1\Logs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\Modules\FlightPlan\FlightPlanLogService;
use App\Http\Requests\Modules\FlightPlans\Logs\UpdateLogRequest;
use App\Exports\GenericExport;
use App\Models\Logs\Log;
use App\Http\Resources\v1\Modules\Logs\LogsPaginationResource;

class LogsModuleController extends Controller
{

    private FlightPlanLogService $service;

    public function __construct(FlightPlanLogService $service)
    {
        $this->service = $service;
    }

    public function index(): \Illuminate\Http\Response
    {
        try {

            Gate::authorize('flight_plans_read');

            $result = $this->service->getPaginate(
                request()->limit,
                request()->page,
                is_null(request()->search) ? "0" : request()->search
            );

            if ($result->total() == 0) {
                throw new \Exception("Nenhum log encontrado", 404);
            }

            return response(new LogsPaginationResource($result), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function exportTableAsCsv(Request $request)
    {
        ob_end_clean();
        ob_start();
        return Excel::download(new GenericExport(new Log(), $request->limit), 'logs.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function store(Request $request): \Illuminate\Http\Response
    {
        try {
            Gate::authorize('flight_plans_write');

            $kml_logs = $request->file('files');
            $kml_logs_images = $request->file('images');

            $this->service->createOne(["logs" => $kml_logs, "images" => $kml_logs_images]);
            return response(["message" => "Log criado com sucesso!"], 201);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function update(UpdateLogRequest $request, $id): \Illuminate\Http\Response
    {
        try {
            Gate::authorize('flight_plans_write');

            $this->service->updateOne($request->only(["name", "service_order_id", "undelete"]), $id);
            return response(["message" => "Log atualizado com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy(Request $request): \Illuminate\Http\Response
    {
        try {
            Gate::authorize('flight_plans_write');

            $this->service->delete($request->ids);
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
