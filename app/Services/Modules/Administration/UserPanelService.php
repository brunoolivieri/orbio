<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Str;
use App\Notifications\Modules\Administration\User\UserCreatedNotification;
// Contracts
use App\Services\Contracts\ServiceInterface;
// Repository
use App\Repositories\Modules\Administration\UserRepository;
// Resource
use App\Http\Resources\Modules\Administration\UsersPanelResource;

class UserPanelService implements ServiceInterface
{

    function __construct(UserRepository $userRepository)
    {
        $this->repository = $userRepository;
    }

    public function getPaginate(string $limit, string $page, string $search)
    {
        $data = $this->repository->getPaginate($limit, $page, $search);

        if ($data->total() > 0) {
            return response(new UsersPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum usuário encontrado."], 404);
        }
    }

    public function createOne(array $data)
    {
        $random_password = Str::random(10);
        $data["password"] = $random_password;

        $user = $this->repository->createOne(collect($data));

        $user->notify(new UserCreatedNotification($user, $random_password));

        return response(["message" => "Usuário criado com sucesso!"], 201);
    }

    public function updateOne(array $data, string $identifier)
    {
        return $this->repository->updateOne(collect($data), $identifier);
    }

    public function delete(array $ids)
    {
        return $this->repository->delete($ids);
    }
}
