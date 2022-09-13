<?php

namespace App\Repositories\Modules\Administration;;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Collection;
// Model
use App\Models\Profiles\Profile;

class ProfileRepository implements RepositoryInterface
{
    public function __construct(Profile $profileModel)
    {
        $this->profileModel = $profileModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->profileModel->with("modules")
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page_number);
    }

    function createOne(Collection $data)
    {
        $profile = $this->profileModel->create($data->only(["name"]));

        $this->profileModel->modules->insert(
            ["module_id" => 1, "profile_id" => $profile->id, "read" => false, "write" => false],
            ["module_id" => 2, "profile_id" => $profile->id, "read" => false, "write" => false],
            ["module_id" => 3, "profile_id" => $profile->id, "read" => false, "write" => false],
            ["module_id" => 4, "profile_id" => $profile->id, "read" => false, "write" => false],
            ["module_id" => 5, "profile_id" => $profile->id, "read" => false, "write" => false],
            ["module_id" => 6, "profile_id" => $profile->id, "read" => false, "write" => false]
        );

        return $profile;
    }

    function updateOne(Collection $data, string $identifier)
    {
        $profile = $this->profileModel->findOrFail($identifier);

        $profile->update($data->only(["name"]));

        foreach ($data->get("privileges") as $profile_privileges) {
            foreach ($profile->modules as $record) {

                $record->pivot->update([
                    'read' => $profile_privileges["read"],
                    'write' => $profile_privileges["write"]
                ]);
            }
        }

        $profile->refresh();

        return $profile;
    }

    function deleteOne(string $identifier)
    {
        $profile = $this->profileModel->findOrFail($identifier);

        // Turn all related users into visitants
        if (!empty($profile->users)) {
            $profile->users()->update(["profile_id" => 5]);
        }

        $profile->delete();

        return $profile;
    }
}
