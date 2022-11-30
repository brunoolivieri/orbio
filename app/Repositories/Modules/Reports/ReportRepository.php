<?php

namespace App\Repositories\Modules\Reports;

use App\Repositories\Contracts\RepositoryInterface;
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

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->reportModel
            ->with("service_order")
            ->search($search) // scope
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page);
    }

    function createOne(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $report = $this->reportModel->create([
                "name" => $data->get("name"),
                "file" => $data->get("filename"),
                "blob" => $data->get("blob"),
                "observation" => null
            ]);

            // Relate the created report to the service order
            $this->serviceOrderModel->where("id", $data->get("service_order_id"))->update([
                "report_id" => $report->id,
                "status" => false
            ]);

            // Save the report PDF in the storage
            Storage::disk('public')->put($data->get('path'), $data->get('file_content'));

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

    function delete(array $ids)
    {
        foreach ($ids as $report_id) {
            $report = $this->reportModel->findOrFail($report_id);

            $report->delete();
        }

        return $report;
    }
}
