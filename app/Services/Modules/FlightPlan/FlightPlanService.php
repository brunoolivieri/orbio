<?php

namespace App\Services\Modules\FlightPlan;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
// Contracts
use App\Services\Contracts\ServiceInterface;
// Repository
use App\Repositories\Modules\FlightPlans\FlightPlanRepository;
// Resources
use App\Http\Resources\Modules\FlightPlans\FlightPlansPanelResource;
// Traits
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
        $data = $this->repository->getPaginate($limit, $page, $search);

        if ($data->total() > 0) {
            return response(new FlightPlansPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum plano de voo encontrado."], 404);
        }
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
        if (is_null($data["file"])) {
            return response(["message" => "Falha na criação do plano de voo."], 500);
        }

        // Filename is the hash of the content
        $file_content = file_get_contents($data["file"]);
        $file_content_hash = md5($file_content);
        $filename = $file_content_hash . ".txt";
        $path = "flight_plans/" . $filename;

        $data["description"] = $data["description"] === "none" ? "N/A" : $data["description"];
        $data["file_content"] = $file_content;
        $data["filename"] = $filename;
        $data["path"] = $path;

        $address_components = Http::get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" . $data["coordinates"] . "&key=" . env("GOOGLE_API_KEY"))["results"][0]["address_components"];

        $data["city"] = $address_components[2]["long_name"];
        $data["state"] = strlen($address_components[3]["short_name"]) === 2 ? $address_components[3]["short_name"] : $address_components[4]["short_name"];

        $flight_plan = $this->repository->createOne(collect($data));

        return response(["message" => "Plano de voo criado com sucesso!"], 200);
    }

    function updateOne(array $data, string $identifier)
    {
        $flight_plan = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Plano de voo atualizado com sucesso!"], 200);
    }

    function delete(array $ids)
    {
        $flight_plan = $this->repository->delete($ids);

        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
