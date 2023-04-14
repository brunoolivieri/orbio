<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\Http;
use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\FlightPlans\FlightPlanRepository;

class FlightPlanService implements ServiceInterface
{

    function __construct(FlightPlanRepository $flightPlanRepository)
    {
        $this->repository = $flightPlanRepository;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->repository->getPaginate($limit, $page, $search);
    }

    function createOne(array $data)
    {
        if (is_null($data["route_files"]) || is_null($data["imageDataURL"])) {
            return response(["message" => "Erro! O plano de voo não pode ser criado."], 500);
        }

        foreach ($data["route_files"] as $index => $route_file) {

            $filename = $route_file->getClientOriginalName();
            $contents = file_get_contents($route_file);
            $path = "flight_plans/" . $filename;

            $data_to_save["routes_filename"][$index] = $filename;

            $data_to_save["route_files"][$index] = [
                "contents" => $contents,
                "filename" => $filename,
                "path" => $path
            ];
        }

        $img = str_replace('data:image/jpeg;base64,', '', $data["imageDataURL"]);
        $img = str_replace(' ', '+', $img);

        $data_to_save["image"] = [
            "path" => "images/flight_plans/" . $data["imageFilename"],
            "contents" => base64_decode($img)
        ];

        $data_to_save["coordinates"] = $data["coordinates"][0];

        // Fetch google API to get city and state of flight plan location
        $address_components = Http::get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" . $data_to_save["coordinates"] . "&key=" . env("GOOGLE_GEOCODING_API_KEY"))["results"][0]["address_components"];

        $data_to_save["city"] = $address_components[2]["long_name"];
        $data_to_save["state"] = strlen($address_components[3]["short_name"]) === 2 ? $address_components[3]["short_name"] : $address_components[4]["short_name"];

        $this->repository->createOne(collect($data_to_save));
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

            throw new \Exception($message, 409);
        }
    }
}
