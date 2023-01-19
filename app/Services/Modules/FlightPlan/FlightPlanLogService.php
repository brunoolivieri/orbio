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

    function processSelectedLogs(array $logs = [])
    {

        $data = [];

        try {

            foreach ($logs as $index => $log) {

                $original_log_name = $log->getClientOriginalName();

                // Actual log is a tlog.kmz
                if (preg_match("/\.tlog\.kmz$/", $original_log_name)) {

                    // Converted [name].tlog.kmz to [name].tlog.kml
                    $kml_filename = preg_replace("/\.tlog\.kmz$/", ".kml", $original_log_name);

                    // Check if $kml_filename already exists in storage
                    if (Storage::disk('public')->exists("flight_plans/flightlogs/kml/" . $kml_filename)) {

                        $data[$index] = [
                            "status" => [
                                "is_valid" => false,
                                "message" => "Já existe"
                            ],
                            "size" => filesize($log),
                            "original_name" => $original_log_name
                        ];

                        // If $kml_filename not exists in storage
                    } else {

                        // Extraction 

                        $zip = new ZipArchive;

                        // If actual tlog file can be open
                        if ($zip->open($log)) {

                            // Loop folder and files 
                            for ($i = 0; $i < $zip->numFiles; $i++) {

                                // Get actual filename
                                $file_fullpath = $zip->getNameIndex($i);

                                // Check if filename has extension kml
                                if (preg_match('/\.kml$/i', $file_fullpath)) {

                                    $tlog_kml_content = $zip->getFromIndex($i);
                                }
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

                            // Actual tlog.kml is valid and generated a KML
                            $data[$index] = [
                                "status" => [
                                    "is_valid" => true,
                                    "message" => "Processado"
                                ],
                                "size" => filesize($log),
                                "timestamp" => preg_replace('/\D/', "", $original_log_name), // Remove non-numeric from timestamp
                                "original_name" => $original_log_name,
                                "name" => $kml_filename,
                                "storage_path" => "flight_plans/flightlogs/kml/" . $kml_filename,
                                "contents" => $kml_string_content
                            ];

                            // If actual tlog cant be open
                        } else {

                            $data[$index] = [
                                "status" => [
                                    "is_valid" => false,
                                    "message" => "Corrompido"
                                ],
                                "size" => filesize($log),
                                "original_name" => $original_log_name
                            ];
                        }
                    }

                    // Actual log is a .kml
                }
                if (preg_match("/\.kml$/", $original_log_name)) {

                    // Check if already exists
                    if (Storage::disk('public')->exists("flight_plans/flightlogs/kml/" . $original_log_name)) {

                        $data[$index] = [
                            "status" => [
                                "is_valid" => false,
                                "message" => "Já existe"
                            ],
                            "size" => filesize($log),
                            "original_name" => $original_log_name
                        ];
                    } else {

                        // Future: verify file integrity with libxml and SimpleXML

                        $data[$index] = [
                            "status" => [
                                "is_valid" => true,
                                "message" => "Processado"
                            ],
                            "timestamp" => preg_replace('/\D/', "", $original_log_name),
                            "size" => filesize($log),
                            "original_name" => $original_log_name,
                            "storage_path" => "flight_plans/flightlogs/kml/" . $original_log_name,
                            "contents" => file_get_contents($log)
                        ];
                    }
                }
            }

            return response($data, 200);
        } catch (\Exception $e) {

            return response(["message" => $e->getMessage()], 403);
        }
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
