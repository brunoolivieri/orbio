<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Str;
use Exception;
use App\Notifications\Modules\Administration\User\UserCreatedNotification;
use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\Administration\UserRepository;

class UserPanelService implements ServiceInterface
{

    function __construct(UserRepository $userRepository)
    {
        $this->repository = $userRepository;
    }

    public function getPaginate(string $limit, string $page, string $search)
    {
        return $this->repository->getPaginate($limit, $page, $search);
    }

    public function createOne(array $data)
    {
        $random_password = Str::random(10);
        $data["password"] = $random_password;

        $user = $this->repository->createOne(collect($data));

        $user->notify(new UserCreatedNotification($user, $random_password));
    }

    public function updateOne(array $data, string $identifier)
    {
        $user = $this->repository->updateOne(collect($data), $identifier);
    }

    public function delete(array $ids)
    {
        $undeleteable_ids = $this->repository->delete($ids);

        if (count($undeleteable_ids) > 0) {

            $message = "";

            if (count($undeleteable_ids) === count($ids)) {
                if (count($undeleteable_ids) === 1) {
                    $message = "Erro! O usuário possui vínculo com ordem de serviço ativa!";
                } else {
                    $message = "Erro! Os usuários possuem vínculo com ordem de serviço ativa!";
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
            }

            throw new Exception($message);
        }
    }
}
