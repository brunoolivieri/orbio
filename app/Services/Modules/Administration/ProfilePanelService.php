<?php

namespace App\Services\Modules\Administration;

// Contracts
use App\Services\Contracts\ServiceInterface;
// Repository
use App\Repositories\Modules\Administration\ProfileRepository;
// Resource
use App\Http\Resources\Modules\Administration\ProfilesPanelResource;

class ProfilePanelService implements ServiceInterface
{

    function __construct(ProfileRepository $profileRepository)
    {
        $this->repository = $profileRepository;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        $data = $this->repository->getPaginate($limit, $page, $search);

        if ($data->total() > 0) {
            return response(new ProfilesPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum perfil encontrado."], 404);
        }
    }

    function createOne(array $data)
    {
        $profile = $this->repository->createOne(collect($data));

        return response(["message" => "Perfil criado com sucesso!"], 201);
    }

    function updateOne(array $data, string $identifier)
    {
        $profile = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Perfil atualizado com sucesso!"], 200);
    }

    function delete(array $ids)
    {
        $profile = $this->repository->delete($ids);

        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
