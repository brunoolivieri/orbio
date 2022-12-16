<?php

namespace App\Repositories\Modules\Administration;;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
// Model
use App\Models\Users\User;
use App\Models\Profiles\Profile;

class UserRepository implements RepositoryInterface
{
    public function __construct(User $userModel, Profile $profileModel)
    {
        $this->userModel = $userModel;
        $this->profileModel = $profileModel;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->userModel->with(["profile:id,name"])
            ->search($search) // scope
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page);
    }

    function createOne(Collection $data)
    {
        return $this->userModel->create([
            "name" => $data->get("name"),
            "email" => $data->get("email"),
            "profile_id" => $data->get("profile_id"),
            "password" => Hash::make($data->get("password"))
        ]);
    }

    function updateOne(Collection $data, string $identifier)
    {
        $user = $this->userModel->findOrFail($identifier);

        $new_profile = $this->profileModel->findOrFail($data->get("profile_id"));

        // Check if user is related to a active service order with different role
        foreach ($user->service_orders as $service_order) {
            if ($service_order->status) {
                if (strtolower($service_order->pivot->role) != strtolower($new_profile->name)) {
                    return response(["message" => "Possui vínculo como {$service_order->pivot->role} a uma ordem de serviço ativa!"], 500);
                }
            }
        }

        $user->update($data->only(["name", "email", "profile_id"])->all());

        $user->refresh();

        return response(["message" => "Usuário atualizado com sucesso!"], 200);
    }

    function delete(array $ids)
    {

        $undeleteable_ids = [];
        foreach ($ids as $user_id) {

            $user = $this->userModel->findOrFail($user_id);

            // Check if user is related to a active service order 
            foreach ($user->service_orders as $service_order) {
                if ($service_order->status) {
                    array_push($undeleteable_ids, $user_id);
                }
            }
        }

        // Deletion will occur only if all flight plans can be deleted
        if (count($undeleteable_ids) === 0) {
            $user->whereIn("id", $ids)->delete();
        }

        return $undeleteable_ids;
    }
}
