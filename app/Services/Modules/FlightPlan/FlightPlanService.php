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
        $undeleteable_ids = $this->repository->delete($ids);

        $total_selected_ids = count($ids);
        $total_undeleteable_ids = count($undeleteable_ids);

        if ($total_undeleteable_ids === 0) {
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } else if ($total_undeleteable_ids === $total_selected_ids) {

            if ($total_selected_ids === 1) {
                return response(["message" => "O plano não pode ser deletado porque possui vínculo com ordem de serviço ativa!"], 500);
            } else if ($total_selected_ids > 1) {
                return response(["message" => "Nenhum plano pode ser deletado porque todos possuem vínculo com ordem de serviço ativa!"], 500);
            }
        } else if ($total_undeleteable_ids > 0 && $total_undeleteable_ids < $total_selected_ids) {

            if ($total_undeleteable_ids === 1) {
                $response = "A deleção falhou porque o plano de id ";
            } else if ($total_undeleteable_ids > 1) {
                $response = "A deleção falhou porque os planos de id ";
            }

            foreach ($undeleteable_ids as $index => $undeleted_id) {

                // If is not the last item
                if ($total_undeleteable_ids > ($index + 1)) {

                    $response .= $undeleted_id .  ", ";

                    // if is the last item
                } else if ($total_undeleteable_ids === ($index + 1)) {

                    if ($total_undeleteable_ids === 1) {
                        $response .= $undeleted_id . " possui vínculo com ordem de serviço ativa!";
                    } else if ($total_undeleteable_ids > 1) {
                        $response .= $undeleted_id . " possuem vínculo com ordem de serviço ativa!";
                    }
                }
            }

            return response(["message" => $response], 500);
        }
    }
}
