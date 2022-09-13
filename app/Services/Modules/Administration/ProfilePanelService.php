<?php

namespace App\Services\Modules\Administration;

// Repository
use App\Repositories\Modules\Administration\ProfileRepository;
// Resource
use App\Http\Resources\Modules\Administration\ProfilesPanelResource;
// Interface
use App\Contracts\ServiceInterface;

class ProfilePanelService implements ServiceInterface
{

    function __construct(ProfileRepository $profileRepository)
    {
        $this->repository = $profileRepository;
    }

    function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        $data = $this->repository->getPaginate($limit, $order_by, $page_number, $search, $filters);

        if ($data->total() > 0) {
            return response(new ProfilesPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum perfil encontrado."], 404);
        }
    }

    function createResource(array $data)
    {
        $profile = $this->repository->createOne(collect($data));

        return response(["message" => "Perfil criado com sucesso!"], 201);
    }

    function updateResource(array $data, string $identifier)
    {
        $profile = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Perfil atualizado com sucesso!"], 200);
    }

    function deleteResource(string $identifier)
    {
        $profile = $this->repository->deleteOne($identifier);

        return response(["message" => "Perfil deletado com sucesso!"], 200);
    }
}
