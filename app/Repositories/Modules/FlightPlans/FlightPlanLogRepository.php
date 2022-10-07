<?php

namespace App\Repositories\Modules\FlightPlans;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
// Model
use App\Models\Logs\Log;

class FlightPlanLogRepository implements RepositoryInterface
{
    public function __construct(Log $logModel)
    {
        $this->logModel = $logModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->logModel
            ->with("flight_plan")
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);
    }

    function createOne(Collection $data)
    {

        DB::transaction(function () use ($data) {

            $this->logModel->create([
                "flight_plan_id" => $data->get("flight_plan_id"),
                "name" => $data->get("name"),
                "path" => $data->get("path"),
                "timestamp" => $data->get("timestamp")
            ]);
        });

        Storage::disk('public')->put($data->get("path"), $data->get('file_content'));
    }

    function updateOne(Collection $data, string $identifier)
    {
    }

    function deleteOne(string $identifier)
    {
    }
}
