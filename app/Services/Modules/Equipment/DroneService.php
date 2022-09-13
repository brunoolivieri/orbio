<?php

namespace App\Services\Modules\Equipment;

// Repository
use App\Repositories\Modules\Equipment\DroneRepository;
// Resources
use App\Http\Resources\Modules\Equipments\DronesPanelResource;
// Contracts
use App\Contracts\ServiceInterface;

class DroneService implements ServiceInterface
{
    function __construct(DroneRepository $droneRepository)
    {
        $this->repository = $droneRepository;
    }

    public function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        $data = $this->repository->getPaginate($limit, $order_by, $page_number, $search, $filters);

        if ($data->total() > 0) {
            return response(new DronesPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum drone encontrado."], 404);
        }
    }

    public function createResource(array $data)
    {
        // Filename is the hash of the content
        $file_content = file_get_contents($data['image']);
        $content_hash = md5($file_content);
        $filename = "$content_hash.jpg";
        $path = "public/images/drone/" . $filename;

        $data["file_content"] = $file_content;
        $data["path"] = $path;

        $drone = $this->repository->createOne(collect($data));

        return response(["message" => "Drone criado com sucesso!"], 201);
    }

    public function updateResource(array $data, string $identifier)
    {
        if (!is_null($data['image'])) {

            // Filename is the hash of the content
            $file_content = file_get_contents($data['image']);
            $content_hash = md5($file_content);
            $filename = "$content_hash.jpg";
            $path = "public/images/drone/" . $filename;

            $data["change_file"] = 1;
            $data["file_content"] = $file_content;
            $data["path"] = $path;
        } else {
            $data["change_file"] = 0;
        }

        $drone = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Drone atualizado com sucesso!"], 200);
    }

    public function deleteResource(string $identifier): \Illuminate\Http\Response
    {
        $drone = $this->repository->deleteOne($identifier);

        return response(["message" => "Drone deletado com sucesso!"], 200);
    }
}
