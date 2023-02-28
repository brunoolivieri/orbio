<?php

namespace App\Http\Controllers\Modules\FlightPlan\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use ZipArchive;
use SimpleXMLElement;

class UploadedLogsController extends Controller
{

    public function __invoke(Request $request)
    {
        Gate::authorize('flight_plans_write');

        try {

            $logs = $request->file('files');

            foreach ($logs as $index => $log) {

                $original_log_name = $log->getClientOriginalName();
                $is_tlog_kmz = preg_match("/\.tlog\.kmz$/", $original_log_name);

                // The kml filename must be [name].kml - if is different, is certainly a tlog.kmz that need to be converted to .kml
                $kml_filename = $is_tlog_kmz ? preg_replace("/\.tlog\.kmz$/", ".kml", $original_log_name) : $original_log_name;
                $kml_filename_without_extension = str_replace(".kml", "", $kml_filename);

                // Now, being an [filename].kml, lets check if already exists
                $already_exists = Storage::disk('public')->exists("flight_plans/flightlogs/valid/{$kml_filename_without_extension}/" . $kml_filename) || Storage::disk('public')->exists("flight_plans/flightlogs/invalid/{$kml_filename_without_extension}/" . $kml_filename);

                if ($already_exists) {

                    $result[$index] = [
                        "verification" => [
                            "is_valid" => false,
                            "to_save" => false,
                            "message" => "Já existe"
                        ],
                        "size" => filesize($log),
                        "original_name" => $original_log_name,
                        "image" => null,
                        "contents" => null

                    ];
                } else {
                    $result[$index] = $this->processingNewLog($log, $is_tlog_kmz, $kml_filename);
                }

                return response($result, 200);
            }
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    private function processingNewLog($log, $is_kmz, $kml_filename)
    {

        if ($is_kmz) {

            $zip = new ZipArchive;

            if ($zip->open($log)) {

                // Loop folder and files 
                for ($i = 0; $i < $zip->numFiles; $i++) {

                    // Get actual filename
                    $file_fullpath = $zip->getNameIndex($i);

                    // Catch KML file that exists inside
                    if (preg_match('/\.kml$/i', $file_fullpath)) {

                        $tlog_kml_content = $zip->getFromIndex($i);
                    }
                }

                $result = $this->generateKMLFromTlogContent($log, $tlog_kml_content, $kml_filename);
            } else {

                // If actual tlog cant be open

                $result = [
                    "verification" => [
                        "is_valid" => false,
                        "message" => "Corrompido",
                        "to_save" => true
                    ],
                    "size" => filesize($log),
                    "original_name" => $log->getClientOriginalName(),
                    "image" => null,
                    "contents" => null
                ];
            }

            return $result;
        }
    }

    private function generateKMLFromTlogContent($log, $tlog_kml_content, $kml_filename)
    {
        // Acessing .tlog.kml content object
        $tlog_kml_structure = simplexml_load_string($tlog_kml_content);
        $tlog_kml_placemark = $tlog_kml_structure->Document->Folder->Folder->Placemark;
        $tlog_kml_coordinates = (string) $tlog_kml_placemark->LineString->coordinates;

        // Creating .kml from .tlog.kml content 
        $kml = new SimpleXMLElement("<kml />");
        $document = $kml->addChild('Document');
        $placemark = $document->addChild('Placemark');
        $placemark->addChild('name', $tlog_kml_placemark->name);
        $line = $placemark->addChild('LineString');
        $line->addChild('altitudeMode', 'absolute');
        $line->addChild('coordinates', substr($tlog_kml_coordinates, strpos($tlog_kml_coordinates, "\n") + 1)); // string coordinates without the first "\n"

        // kml content as string and filename
        $kml_string_content = $kml->asXML();

        // Actual tlog.kml is valid and generated a KML
        $result = [
            "verification" => [
                "is_valid" => true,
                "to_save" => true,
                "message" => "Processado"
            ],
            "size" => filesize($log),
            "original_name" => $log->getClientOriginalName(),
            "name" => $kml_filename,
            "contents" => $kml_string_content,
            "image" => null
        ];

        return $result;
    }
}
