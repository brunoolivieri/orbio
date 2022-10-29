<?php

namespace App\Services\Modules\Report;

use Illuminate\Support\Facades\Storage;
// Models
use App\Repositories\Modules\Reports\ReportRepository;
// Resources
use App\Http\Resources\Modules\Reports\ReportsPanelResource;
// Contracts
use App\Contracts\ServiceInterface;
// Traits
use App\Traits\DownloadResource;

class ReportService implements ServiceInterface
{

    use DownloadResource;

    public function __construct(ReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        $data = $this->repository->getPaginate($limit, $order_by, $page_number, $search, $filters);

        if ($data->total() > 0) {
            return response(new ReportsPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum relatório encontrado."], 404);
        }
    }

    function downloadResource(string $filename, $identifier = null)
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

    public function createResource(array $data)
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

    public function updateResource(array $data, string $identifier)
    {
        $report = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Relatório atualizado com sucesso!"], 200);
    }

    public function deleteResource(string $identifier)
    {
        //
    }
}
