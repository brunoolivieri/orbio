<?php

namespace App\Http\Controllers\Modules\FlightPlan\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class DownloadFlightPlanController extends Controller
{

    public function __invoke(Request $request)
    {
        try {

            Gate::authorize('flight_plans_read');

            $array_filenames = explode(",", $request->query("files"));
            $pathFolder = $request->get("folder");

            foreach ($array_filenames as $filename) {
                if (!Storage::disk("public")->exists("flight_plans/$pathFolder/$filename")) {
                    throw new \Exception("Erro! O arquivo não foi encontrado.", 404);
                }
            }

            foreach ($array_filenames as $filename) {
                $file_contents = Storage::disk("public")->get("flight_plans/$pathFolder/$filename");
                $contents[$filename] = $file_contents;
            }

            $json_contents = json_encode($contents);

            return response($json_contents)->withHeaders([
                "Content-type" => "application/json"
            ]);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getMessage());
        }
    }
}
