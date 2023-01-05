<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use ZipArchive;
// Contracts
use App\Services\Contracts\ServiceInterface;
// Repository
use App\Repositories\Modules\FlightPlans\FlightPlanLogRepository;
// Resources
use App\Http\Resources\Modules\FlightPlans\FlightPlansLogPanelResource;

class FlightPlanLogService implements ServiceInterface
{

    function __construct(FlightPlanLogRepository $flightPlanLogRepository)
    {
        $this->repository = $flightPlanLogRepository;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        $data = $this->repository->getPaginate($limit, $page, $search);

        if ($data->total() > 0) {
            return response(new FlightPlansLogPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum log encontrado."], 404);
        }
    }

    function download(string $filename, $identifier = null)
    {
        if (Storage::disk("public")->exists("flight_plans/logs/kmz/$filename")) {

            $path = Storage::disk("public")->path("flight_plans/logs/kml/$filename");
            $contents = file_get_contents($path);

            return response($contents)->withHeaders([
                "Content-type" => mime_content_type($path)
            ]);
        } else {

            return response(["message" => "Nenhum arquivo encontrado."], 404);
        }
    }

    function createOne(array $log_files)
    {

        foreach ($log_files as $log_file) {

            // Config to save KMZ as KML

            $kml_filename = str_replace(".kmz", ".kml", $log_file->getClientOriginalName());

            $kml_file_path = "flight_plans/logs/kml/" . $kml_filename;

            // Get KMZ file content

            $contents = file_get_contents($log_file);

            // Save contents as KML file

            Storage::disk('public')->put($kml_file_path, $contents);

            // Remove non-numeric
            $timestamp = preg_replace('/\D/', "", $log_file->getClientOriginalName());

            $data = [
                "flight_plan_id" => null,
                "name" => Str::random(10),
                "filename" => $kml_filename,
                "path" => $kml_file_path,
                "timestamp" => $timestamp
            ];

            $this->repository->createOne(collect($data));
        }

        return response(["message" => "Logs salvos com sucesso!"], 201);
    }

    function updateOne(array $data, string $identifier)
    {
        foreach ($data as $key => $value) {
            if ($value === "0") {
                $data[$key] = null;
            }
        }

        $log = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Log atualizado com sucesso!"], 200);
    }

    function delete(array $ids)
    {
        $log = $this->repository->delete($ids);

        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
