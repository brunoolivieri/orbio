<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// Models
use App\Models\Pivot\ProfileModule;
use App\Models\Profiles\Profile;
// Resources
use App\Http\Resources\Modules\Administration\ProfilesPanelResource;
// Contract
use App\Contracts\ServiceInterface;

class ProfilePanelService implements ServiceInterface
{

    /**
     * Dependency injection.
     * 
     * @param App\Models\Profiles\Profile $profileModel
     * @param App\Models\Pivot\ProfileModule $profileModuleModel
     */
    public function __construct(Profile $profileModel, ProfileModule $profileModuleModel)
    {
        $this->profileModel = $profileModel;
        $this->profileHasModuleModel = $profileModuleModel;
    }

    /**
     * Load all profiles with their modules relationships with pagination.
     *
     * @param int $limit
     * @param int $actual_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, string $order_by, int $page_number, int|string $search, int|array $filters): \Illuminate\Http\Response
    {

        $data = $this->profileModel->with("modules")
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);

        if ($data->total() > 0) {
            return response(new ProfilesPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum perfil encontrado."], 404);
        }
    }

    /**
     * Create profile.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request) {

            $new_profile = $this->profileModel->create($request->validated());

            $this->createProfileModulesRelationship((int) $new_profile->id);
        });

        return response(["message" => "Perfil criado com sucesso!"], 200);
    }

    /**
     * Called from "createProfile" method.
     * Link new profile with modules.
     *
     * @param $new_profile_id
     */
    private function createProfileModulesRelationship(int $new_profile_id)
    {

        $this->profileHasModuleModel->insert([
            ["module_id" => 1, "profile_id" => $new_profile_id, "read" => false, "write" => false],
            ["module_id" => 2, "profile_id" => $new_profile_id, "read" => false, "write" => false],
            ["module_id" => 3, "profile_id" => $new_profile_id, "read" => false, "write" => false],
            ["module_id" => 4, "profile_id" => $new_profile_id, "read" => false, "write" => false],
            ["module_id" => 5, "profile_id" => $new_profile_id, "read" => false, "write" => false],
            ["module_id" => 6, "profile_id" => $new_profile_id, "read" => false, "write" => false]
        ]);
    }

    /**
     * Update profile.
     *
     * @param $request
     * @param $profile_id
     * @return \Illuminate\Http\Response
     */
    public function updateResource(Request $request, int $profile_id): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request, $profile_id) {

            $this->profileModel->where('id', $profile_id)->update($request->validated());

            $this->updateProfileModulesRelationship($profile_id, $request->privileges);
        });

        return response(["message" => "Perfil atualizado com sucesso!"], 200);
    }

    /**
     * Called from "updateProfile" method.
     * Update profile modules relationship.
     *
     * @param $id
     * @param $profile_modules_relationship
     */
    private function updateProfileModulesRelationship(int $profile_id, $profile_modules_relationship)
    {

        DB::transaction(function () use ($profile_id, $profile_modules_relationship) {

            foreach ($profile_modules_relationship as $module_id => $module_privileges) {

                $this->profileHasModuleModel->where('profile_id', $profile_id)
                    ->where('module_id', $module_id)
                    ->update(
                        [
                            'read' => $module_privileges["read"],
                            'write' => $module_privileges["write"]
                        ]
                    );
            }
        });
    }

    /**
     * Soft delete profile.
     *
     * @param $profile_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $profile_id): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($profile_id) {

            $profile = $this->profileModel->findOrFail($profile_id);

            // Desvinculation with all users
            if (!empty($profile->user)) {
                $profile->user()->update(["profile_id" => 5]);
            }

            $profile->delete();
        });

        return response(["message" => "Perfil deletado com sucesso!"], 200);
    }
}
