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
                "name" => $report->name,
                "file" => $report->file,
                "observation" => empty($report->observation) ? "nenhuma" : $report->observation,
                "service_order" => [
                    "id" => $report->service_order->id,
                    "number" => $report->service_order->number,
                    "flight_plans" => $report->service_order->flight_plans
                ],
                "created_at" => date("Y-m-d", strtotime($report->created_at))
            ];
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
