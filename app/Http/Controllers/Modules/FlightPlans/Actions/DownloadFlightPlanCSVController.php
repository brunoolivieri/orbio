<?php

namespace App\Http\Controllers\Modules\FlightPlans\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class DownloadFlightPlanCSVController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            Gate::authorize('flight_plans_read');

            $flight_plan_single_file_path = $request->get("path");

            if(!$file_contents = Storage::disk("public")->get($flight_plan_single_file_path)){
                throw new \Exception("Erro! O arquivo não foi encontrado.", 404);
            }

            $json_contents = json_encode($file_contents);

            return response($json_contents, 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getMessage());
        }
    }
}
