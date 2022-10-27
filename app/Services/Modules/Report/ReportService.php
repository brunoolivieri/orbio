<?php

namespace App\Services\Modules\Report;

// Models
use App\Repositories\Modules\Reports\ReportRepository;
// Resources
use App\Http\Resources\Modules\Reports\ReportsPanelResource;
// Package 
use Barryvdh\DomPDF\Facade\Pdf;

class ReportService
{

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

    public function createResource(array $data)
    {

        // ==== GENERATE PDF DOCUMENT ==== //

        $data_to_create_pdf = [
            "name" => strtoupper($data['name']),
            "client" => strtoupper($data['client']),
            "region" => strtoupper($data['city'] . ", " . $data['state']),
            "farm" => strtoupper($data['farm']),
            "area" => $data['area'],
            "date" => str_replace("-", "/", date("d-m-Y", strtotime($data['date']))),
            "number" => $data['number'],
            "dosage" => $data['dosage'],
            "tables" => [
                [
                    "provider" => $data['provider'],
                    "responsible" => $data['responsible'],
                    "temperature" => [
                        "initial" => $data['temperature'],
                        "final" => $data['temperature']
                    ],
                    "humidity" => [
                        "initial" => $data['humidity'],
                        "final" => $data['humidity']
                    ],
                    "wind" => [
                        "initial" => $data['wind'],
                        "final" => $data['wind']
                    ]
                ]
            ]
        ];

        dd($data_to_create_pdf);

        $pdf = PDF::loadView('pdf.report', compact('data_to_create_pdf'));
        $pdf_content = $pdf->stream();

        // ==== PREPARE DATA TO CREATE RECORD ==== //

        // Report name is the hash of its content
        $report_name = md5($pdf_content) . "pdf";

        $data_to_create_report_record = [
            "name" => $data['name'],
            "observation" => null
        ];

        // Last is a partial path - before will be included the service order factor path
        $data_to_create_report_record["last_path"] = "/reports//" . $report_name;
        $data_to_create_report_record["report_content"] = $pdf_content;

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
