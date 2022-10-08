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

        $this->logs = $this->filterAndFormatLogs($response->json());

        return response($this->logs, 200);
    }

    protected function filterAndFormatLogs(array $logs_array): array
    {
        $all_formated_logs = [];
        foreach ($logs_array as $key => $logs) {

            if ($key === "TlogFiles") {
                $all_formated_logs["tlog"] = count($logs) > 0 ? $this->logFormattingByType($logs, "tlog") : 0;
            } else if ($key === "BinlogFiles") {
                $all_formated_logs["bin"] = count($logs) > 0 ? $this->logFormattingByType($logs, "bin") : 0;
            } else if ($key === "KMZlogFiles") {
                $all_formated_logs["kmz"] = count($logs) > 0 ? $this->logFormattingByType($logs, "kmz") : 0;
            }
        }

        return $all_formated_logs;
    }

    // Receives a set log of specific type (tlog, bin or kmz) and returns it formated
    private function logFormattingByType(array $logs_by_type, string $type): array
    {
        $formated_log_set = [];
        $count = 0;
        foreach ($logs_by_type as $log) {

            if ($log['size'] > 0) {

                if ($type === "tlog") {
                    if (!Storage::disk("public")->exists("flight_plans/logs/tlog/" . $log['name'])) {
                        $formated_log_set[$count] = $this->tlogFormatting($log, $count);
                        $count++;
                    }
                } else if ($type === "bin") {
                    if (!Storage::disk("public")->exists("flight_plans/logs/bin/" . $log['name'])) {
                        $formated_log_set[$count] = $this->kmzFormatting($log, $count);
                        $count++;
                    }
                } else if ($type === "kmz") {
                    if (!Storage::disk("public")->exists("flight_plans/logs/kmz/" . $log['name'])) {
                        $formated_log_set[$count] = $this->binFormatting($log, $count);
                        $count++;
                    }
                }
            }
        }

        // Formated set of tlog, bin or kmz logs
        return $formated_log_set;
    }

    // Receives the set of tlog logs and returns it formated
    private function tlogFormatting(array $log, string $index): array
    {
        $timestamp = strtotime(Str::remove('-', Str::remove('.tlog', Str::remove('tlogs/', $log['key']))));
        $name = $log['name'];
        $size = $log['size'];
        $modified = $log['modified'];

        return [
            "id" => $index + 1,
            "datetime" => date("Y-m-d", $timestamp),
            "name" => $name,
            "size" => $size,
            "modified" => $modified
        ];
    }

    // Receives the set of kmz logs and returns it formated
    private function kmzFormatting(array $log, string $index): array
    {
        $timestamp = strtotime(Str::remove('-', Str::remove('.tlog.kmz', Str::remove('kmzlogs/', $log['key']))));
        $name = $log['name'];
        $size = $log['size'];
        $modified = $log['modified'];

        return [
            "id" => $index + 1,
            "datetime" => date("Y-m-d", $timestamp),
            "name" => $name,
            "size" => $size,
            "modified" => $modified
        ];
    }

    // Receives the set of bin logs and returns it formated
    private function binFormatting(array $log, string $index): array
    {
        $timestamp = strtotime(Str::remove('-', Str::remove('.bin', Str::remove('binlogs/', $log['key']))));
        $name = $log['name'];
        $size = $log['size'];
        $modified = $log['modified'];

        return [
            "id" => $index + 1,
            "datetime" => date("Y-m-d", $timestamp),
            "name" => $name,
            "size" => $size,
            "modified" => $modified
        ];
    }
}
