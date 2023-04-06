<?php

namespace App\Http\Controllers\Modules\FlightPlan\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class DownloadFlightPlanController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        Gate::authorize('flight_plans_read');

        try {

            $array_filenames = explode(",", $request->query("files"));

            foreach ($array_filenames as $filename) {
                if (!Storage::disk("public")->exists("flight_plans/$filename")) {
                    throw new \Exception("Erro! O arquivo não foi encontrado.");
                }
            }

            foreach ($array_filenames as $index => $filename) {
                $file_contents = Storage::disk("public")->get("flight_plans/$filename");
                $contents[$filename] = $file_contents;
            }

            $json_contents = json_encode($contents);

            return response($json_contents)->withHeaders([
                "Content-type" => "application/json"
            ]);
        } catch (\Exception $e) {
            if ($e->getMessage() === "Erro! O arquivo não foi encontrado.") {
                return response(["message" => $e->getMessage()], 404);
            } else {
                return response(["message" => $e->getMessage()], 500);
            }
        }
    }
}
