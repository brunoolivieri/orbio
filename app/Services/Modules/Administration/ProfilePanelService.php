<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Facades\DB;
// Custom
use App\Models\Pivot\ProfileHasModuleModel;
use App\Models\Profiles\ProfileModel;
use App\Models\Modules\ModuleModel;
use App\Services\FormatDataService;

class ProfilePanelService{

    private FormatDataService $format_data_service;
    private ProfileModel $profile_model;
    private ProfileHasModuleModel $profile_module_model;

    /**
    * Dependency injection.
    * 
    * @param App\Services\FormatDataService $service
    * @param App\Models\Pivot\ProfileModel $profile
    * @param App\Models\Pivot\ProfileHasModuleModel $profile_module
    */
    public function __construct(FormatDataService $service, ProfileModel $profile, ProfileHasModuleModel $profile_module){
        $this->format_data_service = $service;
        $this->profile_model = $profile;
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
    public function loadPagination(int $limit, int $current_page, int|string $where_value) {

        $data = DB::table('profile_has_module')
        ->join('profiles', 'profile_has_module.profile_id', '=', 'profiles.id')
        ->join('modules', 'profile_has_module.module_id', '=', 'modules.id')
        ->select('profile_has_module.module_id', 'modules.name', 'profile_has_module.profile_id', 'profiles.name as profile_name', 'profile_has_module.read', 'profile_has_module.write')
        ->where('profiles.deleted_at', null)
        ->when($where_value, function ($query, $where_value) {

            $query->when(is_numeric($where_value), function($query) use ($where_value){

                $query->where('profile_has_module.profile_id', '=', $where_value);

            }, function($query) use ($where_value){

                $query->where('profiles.name', 'LIKE', '%'.$where_value.'%');

            });

        })->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if($data->total() > 0){

            $data_formated = $this->format_data_service->profilePanelDataFormatting($data);

            return response($data_formated, 200);

        }else{

            return response(["error" => "Nenhum perfil encontrado."], 404);

        }

    }

    /**
    * Create profile.
    *
    * @param $request
    * @return \Illuminate\Http\Response
    */
    public function createProfile($request) {

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
    * @param $id
    * @return \Illuminate\Http\Response
    */
    public function updateProfile($request, $profile_id) {

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
    private function updateProfileModulesRelationship($profile_id, $profile_modules_relationship){

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
    public function deleteProfile($profile_id) {

        DB::transaction(function () use ($profile_id) {
            
            $profile = ProfileModel::findOrFail($profile_id);

            // Desvinculation with all users
            if(!empty($profile->user)){ 
                $profile->user()->update(["profile_id" => 5]);
            }
    
            $profile->delete();

        });

        return response(["message" => "Perfil deletado com sucesso!"], 200);

    } 
}