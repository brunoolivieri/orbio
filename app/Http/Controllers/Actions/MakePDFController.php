<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
// Form Request
use App\Http\Requests\PDF\ReportPDFRequest;

class MakePDFController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(ReportPDFRequest $request)
    {

        $data = [
            "name" => strtoupper($request->name),
            "client" => strtoupper($request->client),
            "region" => strtoupper($request->city . ", " . $request->state),
            "farm" => strtoupper($request->farm),
            "area" => $request->area,
            "date" => str_replace("-", "/", date("d-m-Y", strtotime($request->date))),
            "number" => $request->number,
            "dosage" => $request->dosage,
            "tables" => [
                [
                    "provider" => $request->provider,
                    "responsible" => $request->responsible,
                    "temperature" => [
                        "initial" => $request->temperature,
                        "final" => $request->temperature
                    ],
                    "humidity" => [
                        "initial" => $request->humidity,
                        "final" => $request->humidity
                    ],
                    "wind" => [
                        "initial" => $request->wind,
                        "final" => $request->wind
                    ]
                ]
            ]
        ];

        // Se precisar exibir no Browser pode trocar o método ->download(‘nome’) por ->stream()
        // ->save(‘path aqui’)

        $pdf = PDF::loadView('pdf.report', compact('data'));
        $pdf_content = base64_encode($pdf->stream());

        return $pdf_content;
    }
}
