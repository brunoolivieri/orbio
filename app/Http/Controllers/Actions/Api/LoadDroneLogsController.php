<?php

namespace App\Http\Controllers\Actions\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class LoadDroneLogsController extends Controller
{

    private array $logs = [];

    public function __invoke(): \Illuminate\Http\Response
    {
        $ip = request()->ip;
        $http_port = request()->http_port;

        $response = Http::get("http://$ip:$http_port/api/logfiles");

        if ($response->failed()) {
            return response("", $response->status());
        }

        $tlog_files_array = $response->json()["KMZlogFiles"];

        // Get the logs that are not already stored 
        $count = 0;
        foreach ($tlog_files_array as $log) {
            if (!Storage::disk("public")->exists("drone_logs/{$log['name']}")) {
                $this->logs[$count] = $log;
                $count++;
            }
        }

        return response($this->logs, 200);
    }
}
