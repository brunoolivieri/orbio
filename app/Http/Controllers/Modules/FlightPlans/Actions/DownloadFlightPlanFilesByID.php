<?php

namespace App\Http\Controllers\Modules\FlightPlans\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\FlightPlans\FlightPlan;

class DownloadFlightPlanFilesByID extends Controller
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

            foreach ($filesPath as $file_path) {
                if (!Storage::disk("public")->exists($file_path)) {
                    throw new \Exception("Erro! O arquivo não foi encontrado.", 404);
                }
            }

            foreach ($filesPath as $file_path) {
                $file_contents = Storage::disk("public")->get($file_path);
                $filename = explode(".", explode("/", $file_path)[2])[0];
                $contents["files"][$filename] = $file_contents;
            }

            $contents["type"] = $flight_plan->type;

            $json_contents = json_encode($contents);

            return response($json_contents)->withHeaders([
                "Content-type" => "application/json"
            ], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getMessage());
        }
    }
}
