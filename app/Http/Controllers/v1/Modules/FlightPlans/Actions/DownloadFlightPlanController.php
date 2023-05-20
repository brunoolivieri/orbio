<?php

namespace App\Http\Controllers\v1\Modules\FlightPlans\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Models\FlightPlans\FlightPlan;

class DownloadFlightPlanController extends Controller
{

    function __construct(FlightPlan $flightPlanModel)
    {
        $this->model = $flightPlanModel;
    }

    public function __invoke(Request $request)
    {
        try {
            Gate::authorize('flight_plans_read');

            $flight_plan = $this->model->find(request()->id);

            $folderFiles = [];

            if (request()->type === "single" || request()->type === "csv") {
                $folderFiles = Storage::disk("public")->files($flight_plan->folder . "/single");
            } else {
                $folderFiles = Storage::disk("public")->files($flight_plan->folder . "/multi");
            }

            $contents = [];

            foreach ($folderFiles as $file_path) {

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
