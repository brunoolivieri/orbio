<?php

namespace App\Http\Controllers\Modules\Reports\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class DownloadReportController extends Controller
{
    
    public function __invoke(Request $request)
    {
        try {

            Gate::authorize('reports_read');

            $filename = request()->filename;

            if (!Storage::disk("public")->exists("reports/$filename")) {
                throw new \Exception("Erro! O relatório não foi encontrado.", 404);
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
