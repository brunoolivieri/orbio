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

            if ($key === "KMZlogFiles") {
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

            $is_size_valid = $log['size'] > 0;
            $is_date_valid = (bool) strtotime($log['modified']);

            if ($is_size_valid && $is_date_valid) {

                if ($type === "kmz") {
                    if (!Storage::disk("public")->exists("flight_plans/logs/kmz/" . $log['name'])) {
                        $formated_log_set[$count] = $this->kmzFormattingAndConversionToKML($log, $count);
                        $count++;
                    }
                }
            }
        }

        // Formated set of tlog, bin or kmz logs
        return $formated_log_set;
    }

     // Receives the set of kmz logs and returns it formated
     private function kmzFormattingAndConversionToKML(array $log, string $index): array
     {
         $timestamp = strtotime(Str::remove('.tlog.kmz', $log['name']));
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
