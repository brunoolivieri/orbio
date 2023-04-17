<?php

namespace App\Repositories\Modules\Reports;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
            ->withTrashed()
            ->search($search) // scope
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page);
    }

    function createOne(array $data)
    {
        return DB::transaction(function () use ($data) {

            $report = $this->reportModel->create([
                "name" => $data["name"],
                "file" => $data["filename"],
                "blob" => $data["blob"],
                "observation" => null
            ]);

            // Relate the created report to the service order
            $this->serviceOrderModel->where("id", $data["service_order_id"])->update([
                "report_id" => $report->id,
                "status" => false
            ]);

            // Save the report PDF in the storage
            Storage::disk('public')->put($data['storage_path'], $data['file_content']);

            return $report;
        });
    }

    function updateOne(array $data, string $id)
    {
        $report = $this->reportModel->withTrashed()->findOrFail($id);
       
        $report->update([
            "name" => $data["name"],
            "observation" => $data["observation"]
        ]);

        if ($report->trashed() && $data["undelete"]) {
            $report->restore();
        }

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
