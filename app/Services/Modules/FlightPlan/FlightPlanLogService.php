<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use ZipArchive;
use SimpleXMLElement;
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
        if (Storage::disk("public")->exists("flight_plans/flightlogs/kml/$filename")) {

            $path = Storage::disk("public")->path("flight_plans/flightlogs/kml/$filename");
            $contents = file_get_contents($path);

            return response($contents)->withHeaders([
                "Content-type" => mime_content_type($path)
            ]);
        } else {

            return response(["message" => "Nenhum arquivo encontrado."], 404);
        }
    }

    function convertTlogToKml(array $log_files)
    {

        try {

            foreach ($log_files as $index => $log_file) {

                // Extraction 

                $zip = new ZipArchive;

                if ($zip->open($log_file)) {

                    dd($zip->numFiles);

                    // Loop folder and files 
                    for ($i = 0; $i < $zip->numFiles; $i++) {

                        // Get actual filename
                        $file_fullpath = $zip->getNameIndex($i);

                        // Check if filename has extension kml
                        if (preg_match('/\.kml$/i', $file_fullpath)) {

                            // Tlog KML data
                            $tlog_kml_path = $file_fullpath;
                            $tlog_kml_content = $zip->getFromIndex($i);
                            $tlog_kml_filename = str_replace("flightlogs/tlogs/", "", $tlog_kml_path);
                        }
                    }
                } else {

                    return response(["message" => "Erro na extração dos logs!"], 500);
                }

                // Acessing .tlog.kml content object
                $tlog_kml_structure = simplexml_load_string($tlog_kml_content);
                $tlog_kml_placemark = $tlog_kml_structure->Document->Folder->Folder->Placemark;
                $tlog_kml_coordinates = (string) $tlog_kml_placemark->LineString->coordinates;

                // Creating .KML from .tlog.kml content 
                $kml = new SimpleXMLElement("<kml />");
                $document = $kml->addChild('Document');
                $placemark = $document->addChild('Placemark');
                $placemark->addChild('name', $tlog_kml_placemark->name);
                $line = $placemark->addChild('LineString');
                $line->addChild('altitudeMode', 'absolute');
                $line->addChild('coordinates', substr($tlog_kml_coordinates, strpos($tlog_kml_coordinates, "\n") + 1)); // string coordinates without the first "\n"

                // KML content as string and filename
                $kml_string_content = $kml->asXML();

                $kml_filename = str_replace(".tlog", "", str_replace("flightlogs/tlogs/", "", $tlog_kml_path));

                $data[$index] = [
                    "flight_plan_id" => null,
                    "name" => Str::random(10),
                    "files" => [
                        "tlog.kml" => [
                            "filename" => $tlog_kml_filename,
                            "storage_path" => "flight_plans/" . $tlog_kml_path,
                            "contents" => $tlog_kml_content
                        ],
                        "kml" => [
                            "filename" => $kml_filename,
                            "storage_path" => "flight_plans/flightlogs/kml/" . $kml_filename,
                            "contents" => $kml_string_content
                        ]
                    ],
                    "timestamp" => preg_replace('/\D/', "", $log_file->getClientOriginalName()) // Remove non-numeric from timestamp
                ];
            }
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 403);
        }

        return response(["data" => $data], 200);
    }

    function createOne(array $log_files)
    {
        //
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
