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
        $undeleteable_ids = $this->repository->delete($ids);

        if (count($undeleteable_ids) === 0) {
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } else {

            if (count($undeleteable_ids) === count($ids)) {

                if (count($undeleteable_ids) === 1) {
                    return response(["message" => "Erro! O usuário possui vínculo com ordem de serviço ativa!"], 409);
                } else {
                    return response(["message" => "Erro! Os usuários possuem vínculo com ordem de serviço ativa!"], 409);
                }
            } else if (count($undeleteable_ids) < count($ids)) {

                $message = "Erro! Os usuários de id ";
                foreach ($undeleteable_ids as $index => $undeleteable_log_id) {

                    if (count($undeleteable_ids) > ($index + 1)) {
                        $message .= $undeleteable_log_id . ", ";
                    } else if (count($undeleteable_ids) === ($index + 1)) {
                        $message .= $undeleteable_log_id . " possuem vínculo com ordem de serviço ativa!";
                    }
                }

                return response(["message" => $message], 409);
            }
        }
    }
}
