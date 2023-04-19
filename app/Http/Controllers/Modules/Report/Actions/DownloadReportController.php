<?php

namespace App\Http\Controllers\Modules\Report\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class DownloadReportController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        try {

            Gate::authorize('reports_write');

            $filename = $request->query("filename");

            if (!Storage::disk("public")->exists("reports/$filename")) {
                throw new \Exception("Erro! O relatório não foi encontrado", 404);
            }

            $file_contents = Storage::disk("public")->get("reports/$filename");

            return response($file_contents)->withHeaders([
                "Content-type" => "application/json"
            ]);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
