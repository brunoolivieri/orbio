<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
// Custom
use App\Models\Pivot\ServiceOrderHasFlightPlanModel;
use App\Models\FlightPlans\FlightPlanModel;
use App\Models\Reports\ReportModel;
use App\Http\Resources\Modules\FlightPlans\FlightPlansPanelResource;

class FlightPlanService
{

    /**
     * Dependency injection.
     * 
     * @param App\Models\FlightPlans\FlightPlanModel $flight_plan_model
     * @param App\Models\Reports\ReportModel $report_model
     * @param App\Models\Pivot\ServiceOrderHasFlightPlanModel $service_order_has_flight_plan_model
     */
    public function __construct(FlightPlanModel $flight_plan_model, ReportModel $report_model, ServiceOrderHasFlightPlanModel $service_order_has_flight_plan_model)
    {
        $this->flight_plan_model = $flight_plan_model;
        $this->report_model = $report_model;
        $this->service_order_has_flight_plan_model = $service_order_has_flight_plan_model;
    }

    /**
     * Load all flight plans with pagination.
     *
     * @param int $limit
     * @param int $actual_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, string $order_by, int $page_number, int|string $search, int|array $filters)
    {

        $data = FlightPlanModel::where("deleted_at", null)
            ->with("incidents")
            ->with("reports")
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
    public function downloadResource(string $filename)
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
    public function createResource(Request $request)
    {

        if (!$request->file("coordinates_file")) {
            return response(["message" => "Falha na criação do plano de voo."], 500);
        }

        // Filename is the hash of the content
        $file_content_hash = md5(file_get_contents($request->file("coordinates_file")));
        $filename = $file_content_hash . ".txt";
        $storage_folder = "public/flight_plans";

        $this->flight_plan_model->create([
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
    public function updateResource(Request $request, int $flight_plan_id)
    {

        $this->flight_plan_model->where('id', $flight_plan_id)->update([
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
    public function deleteResource(int $flight_plan_id)
    {

        DB::transaction(function () use ($flight_plan_id) {

            $flight_plan =  $this->flight_plan_model->findOrFail($flight_plan_id);

            // Delete related report
            if ($flight_plan->reports->count() > 0) {
                $this->report_model->where("id", $flight_plan->reports->id)->delete();
            }

            // Delete relation in service order pivot table
            if ($flight_plan->has_service_order->count() > 0) {
                $this->service_order_has_flight_plan_model->where("flight_plan_id", $flight_plan->id)->delete();
            }

            // Delete coordinates file from storage
            Storage::disk('public')->delete("flight_plans/" . $flight_plan->coordinates_file);

            $flight_plan->delete();
        });

        return response(["message" => "Plano de voo deletado com sucesso!"], 200);
    }
}
