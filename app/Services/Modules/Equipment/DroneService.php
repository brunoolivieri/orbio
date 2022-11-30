<?php

namespace App\Services\Modules\Equipment;

// Contracts
use App\Services\Contracts\ServiceInterface;
// Repository
use App\Repositories\Modules\Equipments\DroneRepository;
// Resources
use App\Http\Resources\Modules\Equipments\DronesPanelResource;

class DroneService implements ServiceInterface
{
    function __construct(DroneRepository $droneRepository)
    {
        $this->repository = $droneRepository;
    }

    public function getPaginate(string $limit, string $page, string $search)
    {
        $data = $this->repository->getPaginate($limit, $page, $search);

        if ($data->total() > 0) {
            return response(new DronesPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum drone encontrado."], 404);
        }
    }

    public function createOne(array $data)
    {
        // Filename is the hash of the content
        $file_content = file_get_contents($data['image']);
        $content_hash = md5($file_content);
        $filename = "$content_hash.jpg";
        $path = "images/equipments/" . $filename;

        $data["file_content"] = $file_content;
        $data["path"] = $path;

        $drone = $this->repository->createOne(collect($data));

        return response(["message" => "Drone criado com sucesso!"], 201);
    }

    public function updateOne(array $data, string $identifier)
    {
        if (isset($data['image'])) {

            // Filename is the hash of the content
            $file_content = file_get_contents($data['image']);
            $content_hash = md5($file_content);
            $filename = "$content_hash.jpg";
            $path = "images/equipments/" . $filename;

            $data["change_file"] = 1;
            $data["file_content"] = $file_content;
            $data["path"] = $path;
        } else {
            $data["change_file"] = 0;
        }

        $drone = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Drone atualizado com sucesso!"], 200);
    }

    public function delete(array $ids): \Illuminate\Http\Response
    {
        $drone = $this->repository->delete($ids);

        return response(["message" => "Drone deletado com sucesso!"], 200);
    }
}
