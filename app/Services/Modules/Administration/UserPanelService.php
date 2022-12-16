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

        $total_selected_ids = count($ids);
        $total_undeleteable_ids = count($undeleteable_ids);

        if ($total_undeleteable_ids === 0) {
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } else if ($total_undeleteable_ids === $total_selected_ids) {

            if ($total_selected_ids === 1) {
                return response(["message" => "O usuário não pode ser deletado porque possui vínculo com ordem de serviço ativa!"], 500);
            } else if ($total_selected_ids > 1) {
                return response(["message" => "Nenhum usuário pode ser deletado porque todos possuem vínculo com ordem de serviço ativa!"], 500);
            }
        } else if ($total_undeleteable_ids > 0 && $total_undeleteable_ids < $total_selected_ids) {

            if ($total_undeleteable_ids === 1) {
                $response = "A deleção falhou porque o usuário de id ";
            } else if ($total_undeleteable_ids > 1) {
                $response = "A deleção falhou porque os usuários de id ";
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
