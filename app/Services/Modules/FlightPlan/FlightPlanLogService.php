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
        if (Storage::disk("public")->exists("flight_plans/flightlogs/tlogs/$filename")) {

            $path = Storage::disk("public")->path("flight_plans/flightlogs/tlogs/$filename");
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

        try {

            foreach ($log_files as $log_file) {

                // Extraction 

                $zip = new ZipArchive;

                if ($zip->open($log_file)) {

                    // Loop folder and files 
                    for ($i = 0; $i < $zip->numFiles; $i++) {

                        // Get actual filename
                        $filename = $zip->getNameIndex($i);

                        // Check if filename has extension kml
                        if (preg_match('/\.kml$/i', $filename)) {

                            // KML path and contents
                            $kml_path = $filename;
                            $kml_content = $zip->getFromIndex($i);
                        }
                    }
                } else {

                    return response(["message" => "Erro na extração dos logs!"], 500);
                }

                // Remove non-numeric from timestamp
                $timestamp = preg_replace('/\D/', "", $log_file->getClientOriginalName());

                $data = [
                    "flight_plan_id" => null,
                    "name" => Str::random(10),
                    "filename" => str_replace("flightlogs/tlogs/", "", $kml_path),
                    "storage_path" => "flight_plans/" . $kml_path,
                    "timestamp" => $timestamp,
                    "file_content" => $kml_content
                ];

                $this->repository->createOne(collect($data));
            }

        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 403);
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
