<?php

namespace App\Services\Modules\Report;

use Illuminate\Support\Facades\Storage;
use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\Reports\ReportRepository;
use App\Traits\DownloadResource;

class ReportService implements ServiceInterface
{

    use DownloadResource;

    public function __construct(ReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getPaginate(string $limit, string $page, string $search)
    {
        return $this->repository->getPaginate($limit, $page, $search);
    }

    function download(string $filename, $identifier = null)
    {
        if (Storage::disk("public")->exists("reports/$filename")) {

            $path = Storage::disk("public")->path("reports/$filename");
            $contents = file_get_contents($path);

            return response($contents)->withHeaders([
                "Content-type" => mime_content_type($path)
            ]);

        } else {
            return response(["message" => "Nenhum arquivo encontrado."], 404);
        }
    }

    public function createOne(array $data)
    {

        if (is_null($data["file"])) {
            return response(["message" => "Falha na criação do relatório."], 500);
        }

        // Filename is the hash of the content
        $file_content = file_get_contents($data["file"]);
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
