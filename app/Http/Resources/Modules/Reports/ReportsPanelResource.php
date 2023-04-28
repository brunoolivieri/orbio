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

    public function toArray($request)
    {
        foreach ($this->data as $row => $report) {

            $this->formatedData["records"][$row] = [
                "id" => $report->id,
                "name" => $report->name,
                "file" => $report->file,
                "observation" => empty($report->observation) ? "nenhuma" : $report->observation,
                "service_order" => [
                    "number" => $report->service_order->number
                ],
                "created_at" => date("Y-m-d", strtotime($report->created_at)),
                "deleted_at" => $report->deleted_at
            ];

            if ($report->trashed()) {
                $this->formatedData["records"][$row]["status_badge"] = [
                    "label" => "Deletado",
                    "color" => "error"
                ];
            } else {
                $this->formatedData["records"][$row]["status_badge"] = [
                    "label" => "Ativo",
                    "color" => "success"
                ];
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
