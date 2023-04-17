<?php

namespace App\Services\Modules\Report;

use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\Reports\ReportRepository;
use App\Notifications\Modules\Report\ReportCreatedNotification;

class ReportService implements ServiceInterface
{
    public function __construct(ReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getPaginate(string $limit, string $page, string $search)
    {
        return $this->repository->getPaginate($limit, $page, $search);
    }

    public function createOne(array $data)
    {

        if (is_null($data["file"])) {
            throw new \Exception("Erro! O arquivo não foi enviado.");
        }

        $file_content = file_get_contents($data["file"]);
        $filename = time() . ".pdf";
        $path = "reports/" . $filename;

        $data["file_content"] = $file_content;
        $data["filename"] = $filename;
        $data["storage_path"] = $path;

        $report = $this->repository->createOne($data);

        $service_order = $report->service_order;

        // Send notification to users
        foreach ($service_order->users as $user) {
            if ($user->pivot->role === "creator") {
                $user->notify(new ReportCreatedNotification($service_order));
            } else if ($user->pivot->role === "pilot") {
                $user->notify(new ReportCreatedNotification($service_order));
            } else if ($user->pivot->role === "client") {
                $user->notify(new ReportCreatedNotification($service_order));
            }
        }
    }

    public function updateOne(array $data, string $identifier)
    {
        $report = $this->repository->updateOne($data, $identifier);
    }

    public function delete(array $ids)
    {
        $report = $this->repository->delete($ids);
    }
}
