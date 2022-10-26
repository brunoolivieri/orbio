<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
// Repository
use App\Repositories\Modules\FlightPlans\FlightPlanLogRepository;
// Resources
use App\Http\Resources\Modules\FlightPlans\FlightPlansLogPanelResource;
// Contracts
use App\Contracts\ServiceInterface;

class FlightPlanLogService implements ServiceInterface
{

    function __construct(FlightPlanLogRepository $flightPlanLogRepository)
    {
        $this->repository = $flightPlanLogRepository;
    }

    function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        $data = $this->repository->getPaginate($limit, $order_by, $page_number, $search, $filters);

        if ($data->total() > 0) {
            return response(new FlightPlansLogPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum plano de voo encontrado."], 404);
        }
    }

    function createResource(array $data)
    {
        $ip = $data["ip"];
        $http_port = $data["http_port"];
        $selected_logs = $data["logs"];

        foreach ($selected_logs as $logname) {

            $timestamp = Str::remove('-', Str::remove('.tlog.kmz', $logname));

            $file = Http::get("http://$ip:$http_port/logdownload/kmzlogs/" . $logname);

            $path = "flight_plans/logs/kmz/" . $logname;

            Storage::disk('public')->put($path, $file);

            $data = [
                "flight_plan_id" => null,
                "name" => Str::random(10),
                "filename" => $logname,
                "path" => $path,
                "timestamp" => $timestamp
            ];

            $this->repository->createOne(collect($data));
        }

        return response(["message" => "Logs salvos com sucesso!"], 201);
    }

    function updateResource(array $data, string $identifier)
    {
        foreach ($data as $key => $value) {
            if ($value === "0") {
                $data[$key] = null;
            }
        }

        $log = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Log atualizado com sucesso!"], 200);
    }

    function deleteResource(string $identifier)
    {
        $log = $this->repository->deleteOne($identifier);

        return response(["message" => "Log deletado com sucesso!"], 200);
    }
}
