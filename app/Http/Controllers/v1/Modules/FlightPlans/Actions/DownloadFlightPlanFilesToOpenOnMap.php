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

            $flightConfiguration = json_decode($flight_plan->configuration);

            if (!Storage::disk("public")->exists($flight_plan->folder . "/single")) {
                throw new \Exception("Erro! O arquivo não foi encontrado.", 404);
            }

            $folderFile = Storage::disk("public")->files($flight_plan->folder . "/single");

            $file_contents = Storage::disk("public")->get($folderFile[0]);

            return response(["contents" => $file_contents, "configuration" => $flightConfiguration])->withHeaders([
                "Content-type" => "application/json"
            ], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getMessage());
        }
    }
}
