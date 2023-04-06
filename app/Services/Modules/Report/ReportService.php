<?php

namespace App\Services\Modules\Report;

use Illuminate\Support\Facades\Storage;
use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\Reports\ReportRepository;

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

        // Filename is the hash of the content
        $file_content = file_get_contents($data["file"]->getRealPath());
        $file_content_hash = md5($file_content);
        $filename = $file_content_hash . ".pdf";
        $path = "reports/" . $filename;

        $data["file_content"] = $file_content;
        $data["filename"] = $filename;
        $data["path"] = $path;

        $report = $this->repository->createOne(collect($data));
    }

    public function updateOne(array $data, string $identifier)
    {
        $report = $this->repository->updateOne(collect($data), $identifier);
    }

    public function delete(array $ids)
    {
        $report = $this->repository->delete($ids);
    }
}
