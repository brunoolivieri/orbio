<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Exception;
use App\Models\Logs\Log;
use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\FlightPlans\FlightPlanLogRepository;

class FlightPlanLogService implements ServiceInterface
{

    function __construct(FlightPlanLogRepository $flightPlanLogRepository)
    {
        $this->repository = $flightPlanLogRepository;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->repository->getPaginate($limit, $page, $search);
    }

    function download(string $filename, $identifier = null)
    {

        $log = Log::where("filename", $filename)->first();

        if (Storage::disk("public")->exists($log->path)) {

            $path = Storage::disk("public")->path($log->path);
            $contents = file_get_contents($path);

            return response($contents)->withHeaders([
                "Content-type" => mime_content_type($path)
            ]);
        } else {

            return response(["message" => "Nenhum arquivo encontrado."], 404);
        }
    }

    function createOne(array $data)
    {

        $logs = $data["logs"];
        $images = $data["images"];

        foreach ($logs as $log) {

            $log_filename = $log->getClientOriginalName();
            $log_filename_without_extension = str_replace(".kml", "", $log_filename);
            $log_content = file_get_contents($log);

            // Get date format from name - can be a timestamp or a date
            $kml_name_numbers = preg_replace("/[^0-9]/", "", $log_filename);
            if (strtotime($kml_name_numbers)) {
                $kml_timestamp = strtotime($kml_name_numbers);
            } else {
                $kml_date = substr($kml_name_numbers, 0, 7); //yyyymmdd
                $kml_timestamp = strtotime($kml_date);
            }

            $log_image_founded = false;
            $image_data = null;
            // Search for actual log image by name in the set of images
            foreach ($images as $image) {

                $image_filename = $image->getClientOriginalName();
                $image_filename_without_extension = preg_replace("/\.(jpe?g|png)$/", "", $image_filename);

                if ($log_filename_without_extension == $image_filename_without_extension) {

                    $log_image_founded = true;

                    $image_data = [
                        "contents" => file_get_contents($image->getRealPath()),
                        "path" => "images/flightlogs/$image_filename"
                    ];
                }
            }

            $log = $this->repository->createOne(collect([
                "name" => Str::random(10),
                "is_valid" => $log_image_founded,
                "filename" => $log_filename,
                "timestamp" => $kml_timestamp,
                "log_storage" => [
                    "contents" => $log_content,
                    "path" => "flightlogs/valid/$log_filename"
                ],
                "image_storage" => $image_data
            ]));
        }
    }

    function updateOne(array $data, string $identifier)
    {
        $log = $this->repository->updateOne(collect($data), $identifier);
    }

    function delete(array $ids)
    {
        $undeleteable_ids = $this->repository->delete($ids);

        if (count($undeleteable_ids) > 0) {

            $message = "";

            if (count($undeleteable_ids) === count($ids)) {
                if (count($undeleteable_ids) === 1) {
                    $message = "Erro! O log possui vínculo com ordem de serviço ativa!";
                } else {
                    $message = "Erro! Os logs possuem vínculo com ordem de serviço ativa!";
                }
            } else if (count($undeleteable_ids) < count($ids)) {

                $message = "Erro! Os logs de id ";
                foreach ($undeleteable_ids as $index => $undeleteable_log_id) {

                    if (count($undeleteable_ids) > ($index + 1)) {
                        $message .= $undeleteable_log_id . ", ";
                    } else if (count($undeleteable_ids) === ($index + 1)) {
                        $message .= $undeleteable_log_id . " possuem vínculo com ordem de serviço ativa!";
                    }
                }
            }

            throw new Exception($message);
        }
    }
}
