<?php

namespace App\Http\Controllers\v1\Modules\Logs\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Models\Logs\Log;

class DownloadLogController extends Controller
{
    public function __invoke(Request $request, string $filename)
    {
        try {
            Gate::authorize('flight_plans_read');

            $log = Log::where("filename", $filename)->first();

            if (!Storage::disk("public")->exists($log->path)) {
                throw new \Exception("Erro! O download do log falhou.", 404);
            }

            $file_contents = Storage::disk("public")->get($log->path);

            return response($file_contents)->withHeaders([
                "Content-type" => "plain/text"
            ]);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
