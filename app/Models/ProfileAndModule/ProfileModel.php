<?php

namespace App\Models\ProfileAndModule;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Models\ProfileAndModule\ProfileHasModuleModel;
use  App\Models\User\UserModel;

class ProfileModel extends Model
{
    use HasFactory;

    protected $table = "profile";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";
    protected $guarded = [];

    function newProfile(array $data) : array {

        try{

            if(ProfileModel::where('nome', $data["nome"])->exists()){

                return ["status" => false, "error" => "name"];

            }else{

                DB::beginTransaction();

                $new_profile_id = DB::table("profile")->insertGetId($data);

                $model = new ProfileHasModuleModel();

                $model_response = $model->newProfileRelationship((int) $new_profile_id);

                if($model_response["status"] && !$model_response["error"]){

                    DB::commit();

                    return ["status" => true, "error" => false];

                }else if(!$model_response["status"] && $model_response["error"]){

                    DB::rollBack();

                    return ["status" => false, "error" => $model_response["error"]];

                }

            }  

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    function loadAllProfiles() : array {

        try{

            $data = ProfileModel::all();

            return ["status" => true, "error" => false, "data" => $data];      
                
        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    function updateProfile(int $profile_id, string $profile_name, array $profile_modules_relationship) : array {

        try{

            if(ProfileModel::where('nome', $profile_name)->where('id', '!=', $profile_id)->exists()){

                return ["status" => false, "error" => "name_already_exists"];

            }else{

                DB::beginTransaction();

                ProfileModel::where('id', $profile_id)->update(["nome" => $profile_name]);

                // O perfil teve seus dados básicos atualizados (tabela 'profile')
                // Agora é preciso atualizar a relação dele com os módulos (tabela 'profile_has_module')

                $model = new ProfileHasModuleModel();

                $model_response = $model->updateProfileModuleRelationship((int) $profile_id, $profile_modules_relationship);

                if($model_response["status"] && !$model_response["error"]){

                    DB::commit();

                    return ["status" => true, "error" => false];

                }else if(!$model_response["status"] && $model_response["error"]){

                    DB::rollBack();

                    return ["status" => false, "error" => $model_response["error"]];

                }

            }

        }catch(\Exception $e){
            
            DB::rollBack();

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Método realizar um DELETE em um registro especifico da tabela "profiles"
     *
     * @param int $userid
     * @return array
     */
    function deleteProfile(int $profile_id) : array {

        try{

            ProfileModel::where('id', $profile_id)->delete();

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }


    }


}
