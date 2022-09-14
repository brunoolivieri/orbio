<?php

namespace App\Repositories\Modules\Administration;;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Collection;
// Model
use App\Models\Users\User;

class UserRepository implements RepositoryInterface
{
    public function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->userModel->with(["profile:id,name"])
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page_number);
    }

    function createOne(Collection $data)
    {
        $user = $this->userModel->create($data->only(["name", "email", "profile_id", "password"])->all());

        return $user;
    }

    function updateOne(Collection $data, string $identifier)
    {
        $user = $this->userModel->findOrFail($identifier);

        $user->update($data->only(["name", "email", "profile_id"])->all());

        $user->refresh();

        return $user;
    }

    function deleteOne(string $identifier)
    {
        $user = $this->userModel->findOrFail($identifier);

        $user->delete();

        return $user;
    }
}
