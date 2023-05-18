<?php

namespace App\Http\Controllers\v1\Modules\FlightPlans\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\FlightPlans\FlightPlan;

class DownloadFlightPlanFilesToOpenOnMap extends Controller
{
    function __construct(FlightPlan $flightPlanModel)
    {
        $this->model = $flightPlanModel;
    }

    public function __invoke(Request $request, string $flight_plan_id)
    {
        try {

            $flight_plan = $this->model->find($flight_plan_id);

            if (!$flight_plan) {
                throw new \Exception("Erro! O plano de voo não foi encontrado.", 404);
            }

            $filesPath = json_decode($flight_plan->files);
            $flightConfiguration = json_decode($flight_plan->configuration);

            foreach ($filesPath as $file_path) {
                if (!Storage::disk("public")->exists($file_path)) {
                    throw new \Exception("Erro! O arquivo não foi encontrado.", 404);
                }
            }

            // Get flight plan timestamp and write the folder path
            $flightPlanTimestamp = explode("/", $filesPath[0])[1];
            $flightPlanStorageFolder = "flight_plans/$flightPlanTimestamp";

            // Get file contents
            $file_path = "$flightPlanStorageFolder/single/$flightPlanTimestamp.txt";
            $file_contents = Storage::disk("public")->get($file_path);

            return response(["contents" => $file_contents, "configuration" => $flightConfiguration])->withHeaders([
                "Content-type" => "application/json"
            ], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getMessage());
        }
    }
}
