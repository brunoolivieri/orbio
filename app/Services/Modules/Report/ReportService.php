<?php

namespace App\Services\Modules\Report;

use Illuminate\Support\Facades\Storage;
// Contracts
use App\Services\Contracts\ServiceInterface;
// Models
use App\Repositories\Modules\Reports\ReportRepository;
// Resources
use App\Http\Resources\Modules\Reports\ReportsPanelResource;
// Traits
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
        $data = $this->repository->getPaginate($limit, $page, $search);

        if ($data->total() > 0) {
            return response(new ReportsPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum relatório encontrado."], 404);
        }
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

        return response(["message" => "Relatório criado com sucesso!"], 200);
    }

    public function updateOne(array $data, string $identifier)
    {
        $report = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Relatório atualizado com sucesso!"], 200);
    }

    public function delete(array $ids)
    {
        $report = $this->repository->delete($ids);

        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
