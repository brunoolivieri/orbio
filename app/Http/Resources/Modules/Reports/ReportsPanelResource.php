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
                "log" => [
                    "name" => $report->logname,
                    "path" => $report->log->path,
                    "datetime" => date("d-m-Y", strtotime($report->log_timestamp))

                ],
                "observation" => empty($report->observation) ? "N/A" : $report->observation
            ];
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
