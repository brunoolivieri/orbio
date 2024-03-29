<?php

namespace App\Repositories\Modules\Administration;;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use App\Models\Profiles\Profile;

class ProfileRepository implements RepositoryInterface
{
    public function __construct(Profile $profileModel)
    {
        $this->profileModel = $profileModel;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->profileModel->with("modules")
            ->withTrashed()
            ->search($search) // scope
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'page', (int) $page);
    }

    function createOne(array $data)
    {
        return DB::transaction(function () use ($data) {

            $profile = $this->profileModel->create([
                "name" => $data["name"],
                "access_data" => json_encode($data["access_data"])
            ]);

            // *Turn into loop*
            $profile->modules()->attach([
                1 => [
                    'read' => $data["privileges"][1]["read"],
                    'write' => $data["privileges"][1]["write"]
                ],
                2 => [
                    'read' => $data["privileges"][2]["read"],
                    'write' => $data["privileges"][2]["write"]
                ],
                3 => [
                    'read' => $data["privileges"][3]["read"],
                    'write' => $data["privileges"][3]["write"]
                ],
                4 => [
                    'read' => $data["privileges"][4]["read"],
                    'write' => $data["privileges"][4]["write"]
                ],
                5 => [
                    'read' => $data["privileges"][5]["read"],
                    'write' => $data["privileges"][5]["write"]
                ]
            ]);

            return $profile;
        });
    }

    function updateOne(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $profile = $this->profileModel->withTrashed()->findOrFail($id);

            $profile->update([
                "name" => $data["name"],
                "access_data" => json_encode($data["access_data"])
            ]);

            if ($profile->trashed() && $data["undelete"]) {
                $profile->restore();
            }

            // *Turn into loop*
            $profile->modules()->sync([
                1 => [
                    'read' => $data["privileges"][1]["read"],
                    'write' => $data["privileges"][1]["write"]
                ],
                2 => [
                    'read' => $data["privileges"][2]["read"],
                    'write' => $data["privileges"][2]["write"]
                ],
                3 => [
                    'read' => $data["privileges"][3]["read"],
                    'write' => $data["privileges"][3]["write"]
                ],
                4 => [
                    'read' => $data["privileges"][4]["read"],
                    'write' => $data["privileges"][4]["write"]
                ],
                5 => [
                    'read' => $data["privileges"][5]["read"],
                    'write' => $data["privileges"][5]["write"]
                ]
            ]);

            $profile->refresh();

            return $profile;
        });
    }

    function delete(array $ids)
    {
        foreach ($ids as $profile_id) {

            $profile = $this->profileModel->findOrFail($profile_id);

            // Turn all related users into visitants
            if (!empty($profile->users)) {
                $profile->users()->update(["profile_id" => 5]);
            }

            $profile->delete();
        }

        return $profile;
    }
}
