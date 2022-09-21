<?php

namespace App\Http\Controllers\Actions\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        $kmz_files_array = $this->filterAndFormatLogs($response->json()["KMZlogFiles"]);

        // Get the logs that are not already stored 
        $count = 0;
        foreach ($kmz_files_array as $log) {

            if (!Storage::disk("public")->exists("drone_logs/{$log['name']}")) {

                $this->logs[$count] = $log;
                $count++;
            }
        }

        return response($this->logs, 200);
    }

    protected function filterAndFormatLogs(array $logs_array)
    {
        $filtered_logs = [];
        foreach ($logs_array as $index => $log) {
            if ($log['size'] > 0) {
                $filtered_logs[$index] = $this->logFormatting($log, $index);
            }
        }

        return $filtered_logs;
    }

    private function logFormatting(array $log, string $index)
    {
        $timestamp = strtotime(Str::remove('-', Str::remove('.tlog.kmz', Str::remove('kmzlogs/', $log['key']))));
        $name = $log['name'];
        $size = $log['size'];
        $modified = $log['modified'];

        return [
            "id" => $index+1,
            "datetime" => date("Y-m-d", $timestamp),
            "name" => $name,
            "size" => $size,
            "modified" => $modified
        ];
    }
}
