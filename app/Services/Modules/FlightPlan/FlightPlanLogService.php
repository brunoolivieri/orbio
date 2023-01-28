<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use ZipArchive;
use SimpleXMLElement;
use App\Models\Logs\Log;
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

        $log = Log::where("filename", $filename)->first();

        if (Storage::disk("public")->exists($log->path)) {

            $path = Storage::disk("public")->path($log->path);
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

                $is_kmz = preg_match("/\.tlog\.kmz$/", $original_log_name);

                // If is a .tlog.kmz convert to .kml, if not, original name is already .kml
                $kml_filename = $is_kmz ? preg_replace("/\.tlog\.kmz$/", ".kml", $original_log_name) : $original_log_name;
                $kml_filename_without_extension = str_replace(".kml", "", $kml_filename);

                $already_exists_as_valid_kml = Storage::disk('public')->exists("flight_plans/flightlogs/valid/{$kml_filename_without_extension}/" . $kml_filename);
                $already_exists_as_invalid_kml = Storage::disk('public')->exists("flight_plans/flightlogs/invalid/{$kml_filename_without_extension}/" . $kml_filename);

                if ($already_exists_as_valid_kml || $already_exists_as_invalid_kml) {

                    $data[$index] = [
                        "status" => [
                            "is_valid" => false,
                            "message" => "Já existe",
                            "to_save" => false
                        ],
                        "size" => filesize($log),
                        "original_name" => $original_log_name
                    ];
                } else {

                    if ($is_kmz) {

                        // KMZ is a zipped KML

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
                                    "message" => "Processado",
                                    "to_save" => true
                                ],
                                "size" => filesize($log),
                                "original_name" => $original_log_name,
                                "name" => $kml_filename,
                                "contents" => $kml_string_content,
                                "image" => null
                            ];

                            // If actual tlog cant be open
                        } else {

                            $data[$index] = [
                                "status" => [
                                    "is_valid" => false,
                                    "message" => "Corrompido",
                                    "to_save" => true
                                ],
                                "size" => filesize($log),
                                "original_name" => $original_log_name,
                                "image" => null
                            ];
                        }
                    } else {

                        // Future: verify file integrity with libxml and SimpleXML

                        $data[$index] = [
                            "status" => [
                                "is_valid" => true,
                                "message" => "Processado"
                            ],
                            "size" => filesize($log),
                            "original_name" => $original_log_name,
                            "name" => $original_log_name,
                            "contents" => file_get_contents($log),
                            "image" => null
                        ];
                    }
                }
            }

            return response($data, 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 403);
        }
    }

    function createOne(array $data)
    {

        $logFiles = $data["logs"];
        $logImages = $data["images"];

        foreach ($logFiles as $logFile) {

            $kml_original_filename = $logFile->getClientOriginalName();
            $kml_name_without_extension = str_replace(".kml", "", $kml_original_filename);

            // Get date format from name - can be a timestamp or a date
            $kml_name_numbers = preg_replace("/[^0-9]/", "", $kml_original_filename);
            if(strtotime($kml_name_numbers)){
                $kml_timestamp = strtotime($kml_name_numbers);
            }else{
                $kml_date = substr($kml_name_numbers, 0, 7); //yyyymmdd
                $kml_timestamp = strtotime($kml_date);
            }

            $kml_have_image = false;

            // Search for actual KML image
            foreach ($logImages as $logImage) {

                $kml_have_image = true;

                $image_original_filename = $logImage->getClientOriginalName();
                $image_name_without_extension = str_replace(".jpeg", "", $image_original_filename);

                //dd("KML: {$kml_name_without_extension} | Image: {$image_name_without_extension}");
                if ($kml_name_without_extension === $image_name_without_extension) {

                    $log = $this->repository->createOne(collect([
                        "name" => Str::random(10),
                        "is_valid" => true,
                        "filename" => $kml_original_filename,
                        "timestamp" => $kml_timestamp,
                        "file_storage" => [
                            "path" => "flight_plans/flightlogs/valid/{$kml_name_without_extension}/",
                            "file" => $logFile,
                            "filename" => $kml_original_filename
                        ],
                        "image_storage" => [
                            "path" => "flight_plans/flightlogs/valid/{$kml_name_without_extension}/",
                            "file" => $logImage,
                            "filename" => $image_original_filename
                        ]
                    ]));
                }
            }

            if (!$kml_have_image) {

                $log = $this->repository->createOne([
                    "name" => Str::random(10),
                    "is_valid" => false,
                    "filename" => $kml_original_filename,
                    "timestamp" => $kml_timestamp,
                    "file_storage" => [
                        "path" => "flight_plans/flightlogs/invalid/{$kml_name_without_extension}",
                        "file" => $logFile,
                        "filename" => $kml_original_filename
                    ]
                ]);
            }
        }

        return response(["message" => "Logs salvos com sucesso!"], 200);
    }

    function updateOne(array $data, string $identifier)
    {
        $log = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Log atualizado com sucesso!"], 200);
    }

    function delete(array $ids)
    {
        $log = $this->repository->delete($ids);

        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
