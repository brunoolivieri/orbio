<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// Custom
use App\Models\Pivot\ProfileHasModuleModel;
use App\Models\Profiles\ProfileModel;
use App\Models\Modules\ModuleModel;
use App\Http\Resources\Modules\Administration\ProfilesPanelResource;

class ProfilePanelService{

    private ProfileModel $model;
    private ProfileHasModuleModel $profile_module_model;

    /**
    * Dependency injection.
    * 
    * @param App\Services\FormatDataService $service
    * @param App\Models\Pivot\ProfileModel $profile
    * @param App\Models\Pivot\ProfileHasModuleModel $profile_module
    */
    public function __construct(ProfileModel $profile, ProfileHasModuleModel $profile_module){
        $this->model = $profile;
        $this->profile_module_model = $profile_module;
    }

    /**
    * Load all profiles with their modules relationships with pagination.
    *
    * @param int $limit
    * @param int $actual_page
    * @param int|string $where_value
    * @return \Illuminate\Http\Response
    */
    public function loadResourceWithPagination(int $limit, int $current_page, int|string $where_value) {

        $data = ProfileModel::where("deleted_at", null)
        ->with("module_privileges")
        ->when($where_value, function ($query, $where_value) {

            $query->when(is_numeric($where_value), function($query) use ($where_value) {

                $query->where('id', '=', $where_value);

            }, function($query) use ($where_value) {

                $query->where('name', 'LIKE', '%'.$where_value.'%');

            });

        })
        ->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if($data->total() > 0){
            return response(new ProfilesPanelResource($data), 200);
        }else{
            return response(["message" => "Nenhum perfil encontrado."], 404);
        }

    }

    /**
    * Create profile.
    *
    * @param $request
    * @return \Illuminate\Http\Response
    */
    public function createResource(Request $request) {

        DB::transaction(function () use ($request) {
            
            $new_profile = ProfileModel::create(['name' => $request->name]);

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
    private function createProfileModulesRelationship(int $new_profile_id) {

        ProfileHasModuleModel::insert([
            ["module_id"=> 1, "profile_id"=> $new_profile_id, "read"=> false, "write"=> false],
            ["module_id"=> 2, "profile_id"=> $new_profile_id, "read"=> false, "write"=> false],
            ["module_id"=> 3, "profile_id"=> $new_profile_id, "read"=> false, "write"=> false],
            ["module_id"=> 4, "profile_id"=> $new_profile_id, "read"=> false, "write"=> false],
            ["module_id"=> 5, "profile_id"=> $new_profile_id, "read"=> false, "write"=> false],
            ["module_id"=> 6, "profile_id"=> $new_profile_id, "read"=> false, "write"=> false]
        ]);

    }

    /**
    * Update profile.
    *
    * @param $request
    * @param $profile_id
    * @return \Illuminate\Http\Response
    */
    public function updateResource(Request $request, int $profile_id) {

        DB::transaction(function() use ($request, $profile_id) {

            ProfileModel::where('id', $profile_id)->update(["name" => $request->name]);

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
    private function updateProfileModulesRelationship(int $profile_id, $profile_modules_relationship){

        DB::transaction(function() use ($profile_id, $profile_modules_relationship) {

            foreach($profile_modules_relationship as $module_id => $module_privileges){

                ProfileHasModuleModel::where('profile_id', $profile_id)
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
    public function deleteResource(int $profile_id) {

        DB::transaction(function () use ($profile_id) {
            
            $profile = ProfileModel::findOrFail($profile_id);

            // Desvinculation with all users
            if(!empty($profile->user)){ 
                $profile->user()->update(["profile_id" => 5]);
            }

            //$profile->module_privileges->delete();
    
            $profile->delete();

        });

        return response(["message" => "Perfil deletado com sucesso!"], 200);

    } 
}