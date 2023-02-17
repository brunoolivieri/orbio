<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Exception;
use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\FlightPlans\FlightPlanRepository;
use App\Http\Resources\Modules\FlightPlans\FlightPlansPanelResource;
use App\Traits\DownloadResource;

class FlightPlanService implements ServiceInterface
{

    use DownloadResource;

    function __construct(FlightPlanRepository $flightPlanRepository)
    {
        $this->repository = $flightPlanRepository;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->repository->getPaginate($limit, $page, $search);
    }

    function download(string $filename, $identifier = null)
    {
        if (Storage::disk("public")->exists("flight_plans/$filename")) {

            $path = Storage::disk("public")->path("flight_plans/$filename");
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
        if (is_null($data["routes_file"]) || is_null($data["image_file"])) {
            return response(["message" => "Erro! O plano de voo não pode ser criado."], 500);
        }

        // Routes file data
        $routes_file_content = file_get_contents($data["routes_file"]);
        $routes_filename = md5($routes_file_content) . ".txt";
        $data["routes"] = [
            "content" => $routes_file_content,
            "filename" => $routes_filename,
            "path" => "flight_plans/" . $routes_filename
        ];

        $img = str_replace('data:image/jpeg;base64,', '', $data["image_file"]);
        $img = str_replace(' ', '+', $img);
        $data["image_file"] = base64_decode($img);

        $data["description"] = $data["description"] === "none" ? "nenhuma" : $data["description"];

        // Fetch google API to get city and state of flight plan location
        $address_components = Http::get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" . $data["coordinates"] . "&key=" . env("GOOGLE_GEOCODING_API_KEY"))["results"][0]["address_components"];

        $data["city"] = $address_components[2]["long_name"];
        $data["state"] = strlen($address_components[3]["short_name"]) === 2 ? $address_components[3]["short_name"] : $address_components[4]["short_name"];

        $flight_plan = $this->repository->createOne(collect($data));
    }

    function updateOne(array $data, string $identifier)
    {
        $flight_plan = $this->repository->updateOne(collect($data), $identifier);
    }

    function delete(array $ids)
    {
        $undeleteable_ids = $this->repository->delete($ids);

        if (count($undeleteable_ids) > 0) {

            $message = "";

            if (count($undeleteable_ids) === count($ids)) {
                if (count($undeleteable_ids) === 1) {
                    $message = "Erro! O plano de voo possui vínculo com ordem de serviço ativa!";
                } else {
                    $message = "Erro! Os planos de voo possuem vínculo com ordem de serviço ativa!";
                }
            } else if (count($undeleteable_ids) < count($ids)) {

                $message = "Erro! Os planos de voo de id ";
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
