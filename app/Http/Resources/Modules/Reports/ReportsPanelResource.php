<?php

namespace App\Http\Resources\Modules\Reports;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class ReportsPanelResource extends JsonResource
{

    private LengthAwarePaginator $data;
    private array $formatedData = [];

    function __construct(LengthAwarePaginator $data)
    {
        $this->data = $data;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {

        foreach ($this->data as $row => $report) {

            $this->formatedData["records"][$row] = [
                "id" => $report->id,
                "path" => empty($report->report) ? 0 : $report->report,
                "flight_plan" => $report->flight_plan,
                "log" => [
                    "name" => $report->logname,
                    "path" => $report->log->path,
                    "datetime" => date("d-m-Y", strtotime($report->log_timestamp))

                ],
                "observation" => empty($report->observation) ? "N/A" : $report->observation
            ];

            if (!empty($report->flight_plan)) {
                $this->formatedData["records"][$row]["flight_plan"] = [
                    "name" => $report->flight_plan->name,
                    "path" => $report->flight_plan->file,
                    "coordinates" => $report->flight_plan->coordinates
                ];
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
