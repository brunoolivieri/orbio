<?php

namespace App\Repositories\Modules\Reports;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
// Models
use App\Models\Reports\Report;
use App\Models\ServiceOrders\ServiceOrder;

class ReportRepository implements RepositoryInterface
{
    public function __construct(Report $reportModel, ServiceOrder $serviceOrderModel)
    {
        $this->reportModel = $reportModel;
        $this->serviceOrderModel = $serviceOrderModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->reportModel
            ->with("service_order")
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page_number);
    }

    function createOne(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $service_order = $this->serviceOrderModel->findOrFail($data->get("service_order_id"));

            // Final path: [so uuid]/reports/[report_name.pdf]
            $report_complete_path = $service_order->uuid . $data->get("last_path");

            $report = $this->reportModel->create([
                "name" => $data->get("name"),
                "path" => $report_complete_path,
                "observation" => $data->get("observation")
            ]);

            // Relate the created report to the service order
            $service_order = $this->serviceOrderModel->where("id", $data->get("service_order_id"))->update([
                "report_id" => $report->id
            ]);

            // Save the report PDF in the storage
            Storage::disk('public')->put($report_complete_path, $data->get('report_content'));

            return $report;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        $report = $this->reportModel->findOrFail($identifier);

        $report->update($data->only(["name", "observation"])->all());

        $report->refresh();

        return $report;
    }

    function deleteOne(string $identifier)
    {
        $report = $this->reportModel->findOrFail($identifier);

        $report->delete();

        return $report;
    }
}
