<?php

namespace App\Repositories\Modules\Reports;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Collection;
// Models
use App\Models\Reports\Report;
use App\Models\Logs\Log;

class ReportRepository implements RepositoryInterface
{
    public function __construct(Report $reportModel, Log $logModel)
    {
        $this->reportModel = $reportModel;
        $this->logModel = $logModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->reportModel
            ->with("log")
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page_number);
    }

    function createOne(Collection $data)
    {
        //
    }

    function updateOne(Collection $data, string $identifier)
    {
        //
    }

    function deleteOne(string $identifier)
    {
        //
    }
}
