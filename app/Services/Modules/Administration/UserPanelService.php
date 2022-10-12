<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Str;
use App\Notifications\Modules\Administration\User\UserCreatedNotification;
// Repository
use App\Repositories\Modules\Administration\UserRepository;
// Resource
use App\Http\Resources\Modules\Administration\UsersPanelResource;
// Interface
use App\Contracts\ServiceInterface;

class UserPanelService implements ServiceInterface
{

    function __construct(UserRepository $userRepository)
    {
        $this->repository = $userRepository;
    }

    public function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        $data = $this->repository->getPaginate($limit, $order_by, $page_number, $search, $filters);

        if ($data->total() > 0) {
            return response(new UsersPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum usuário encontrado."], 404);
        }
    }

    public function createResource(array $data)
    {
        $random_password = Str::random(10);
        $data["password"] = $random_password;

        $user = $this->repository->createOne(collect($data));

        $user->notify(new UserCreatedNotification($user, $random_password));

        return response(["message" => "Usuário criado com sucesso!"], 201);
    }

    public function updateResource(array $data, string $identifier)
    {
        return $this->repository->updateOne(collect($data), $identifier);
    }

    public function deleteResource(string $identifier)
    {
        return $this->repository->deleteOne($identifier);
    }
}
