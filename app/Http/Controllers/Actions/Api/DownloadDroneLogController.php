<?php

namespace App\Http\Controllers\Actions\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Reports\Report;
use App\Models\Logs\Log;
use Illuminate\Support\Facades\DB;

class DownloadDroneLogController extends Controller
{

    function __construct(Report $reportModel, Log $logModel)
    {
        $this->reportModel = $reportModel;
        $this->logModel = $logModel;
    }

    function __invoke(Request $request): \Illuminate\Http\Response
    {
        DB::transaction(function () use ($request) {

            $ip = request()->ip;
            $http_port = request()->http_port;

            foreach ($request->logs as $logname) {

                $log_timestamp = Str::remove('-', Str::remove('.tlog.kmz', $logname));

                $file = Http::get("http://$ip:$http_port/logdownload/kmzlogs/" . $logname);

                $path = "logs/kmz/" . $logname;

                Storage::disk('public')->put($path, $file);

                $report = $this->reportModel->create([
                    "logname" => $logname,
                    "report" => null,
                    "log_timestamp" => $log_timestamp,
                    "observation" => null
                ]);

                $report->log()->create([
                    "path" => $path
                ]);
            }
        });

        return response(["message" => "Logs salvos com sucesso!"], 200);
    }
}
