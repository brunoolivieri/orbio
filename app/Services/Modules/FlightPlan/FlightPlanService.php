<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
// Models
use App\Models\FlightPlans\FlightPlan;
use App\Models\Reports\Report;
// Resources
use App\Http\Resources\Modules\FlightPlans\FlightPlansPanelResource;
// Contracts
use App\Contracts\ServiceInterface;
// Traits
use App\Traits\DownloadResource;

class FlightPlanService implements ServiceInterface
{

    use DownloadResource;

    /**
     * Dependency injection.
     * 
     * @param App\Models\FlightPlans\FlightPlan $flightPlanModel
     * @param App\Models\Reports\Report $reportModel
     * @param App\Models\Pivot\ServiceOrderFlightPlan $ServiceOrderFlightPlan
     */
    public function __construct(FlightPlan $flightPlanModel, Report $reportModel)
    {
        $this->flightPlanModel = $flightPlanModel;
        $this->reportModel = $reportModel;
    }

    /**
     * Load all flight plans with pagination.
     *
     * @param int $limit
     * @param int $actual_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters): \Illuminate\Http\Response
    {

        $data = FlightPlan::where("deleted_at", null)
            ->with("incident")
            ->with("report")
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);

        if ($data->total() > 0) {
            return response(new FlightPlansPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum plano de voo encontrado."], 404);
        }
    }

    /**
     * Download the flight plan file.
     * 
     * @param string $filename
     * @return \Illuminate\Http\Response
     */
    public function downloadResource(string $filename): \Illuminate\Http\Response
    {

        if (Storage::disk("public")->exists("flight_plans/$filename")) {

            $path = Storage::disk("public")->path("flight_plans/$filename");
            $contents = file_get_contents($path);

            return response($contents)->withHeaders([
                "Content-type" => mime_content_type($path)
            ]);
        } else {

            return response(["message" => "Nenhum arquivo encontrado."], 404);
        }
    }

    /**
     * Create flight plan.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request): \Illuminate\Http\Response
    {

        if (!$request->file("coordinates_file")) {
            return response(["message" => "Falha na criação do plano de voo."], 500);
        }

        // Filename is the hash of the content
        $file_content_hash = md5(file_get_contents($request->file("coordinates_file")));
        $filename = $file_content_hash . ".txt";
        $storage_folder = "public/flight_plans";

        $this->flightPlanModel->create([
            "report_id" => null,
            "incident_id" => null,
            "name" => $request->name,
            "coordinates_file" => $filename,
            "description" => $request->description == "none" ? "N/A" : $request->description,
            "status" => 0
        ]);

        // Flight plan is stored just if does not already exists
        if (!Storage::disk('public')->exists($storage_folder . $filename)) {
            $request->file('coordinates_file')->storeAs($storage_folder, $filename);
        }

        return response(["message" => "Plano de voo criado com sucesso!"], 200);
    }

    /**
     * Update flight plan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param int $flight_plan_id
     * @return \Illuminate\Http\Response
     */
    public function updateResource(Request $request, int $flight_plan_id): \Illuminate\Http\Response
    {

        $this->flightPlanModel->where('id', $flight_plan_id)->update([
            "name" => $request->name,
            "report_id" => $request->report_id == 0 ? null : $request->report_id,
            "incident_id" => $request->incident_id == 0 ? null : $request->incident_id,
            "description" => $request->description,
            "status" => $request->status
        ]);

        return response(["message" => "Plano de voo atualizado com sucesso!"], 200);
    }

    /**
     * Soft delete flight plan.
     *
     * @param int $flight_plan_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $flight_plan_id): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($flight_plan_id) {

            $flight_plan =  $this->flightPlanModel->findOrFail($flight_plan_id);

            // Delete related report
            if ($flight_plan->report->count() > 0) {
                $this->reportModel->where("id", $flight_plan->report->id)->delete();
            }

            $flight_plan->delete();
        });

        return response(["message" => "Plano de voo deletado com sucesso!"], 200);
    }
}
