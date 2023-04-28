<?php

namespace App\Http\Controllers\Modules\FlightPlans\Actions;

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

            $filesPath = explode(",", $request->query("files"));

            foreach ($filesPath as $file_path) {

                if (!$file_contents = Storage::disk("public")->get($file_path)) {
                    throw new \Exception("Erro! O arquivo não foi encontrado.", 404);
                }

                $filename = explode(".", explode("/", $file_path)[3])[0];
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
