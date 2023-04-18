<?php

namespace App\Http\Controllers\Modules\FlightPlan\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class DownloadFlightPlanCSVController extends Controller
{
    public function __invoke(Request $request)
    {
        try {

            Gate::authorize('flight_plans_read');

            $pathFolder = $request->get("folder");
            $filename = $pathFolder . ".csv";

            if (!Storage::disk("public")->exists("flight_plans/$pathFolder/csv/$filename")) {
                throw new \Exception("Erro! O arquivo não foi encontrado.", 404);
            }

            $file_contents = Storage::disk("public")->get("flight_plans/$pathFolder/csv/$filename");
            $json_contents = json_encode($file_contents);

            return response($json_contents, 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getMessage());
        }
    }
}
