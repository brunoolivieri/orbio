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

    function newProfile(array $data) : array {

        try{

            DB::beginTransaction();

            if(ProfileModel::where('nome', $data["profile_name"])->exists()){

                DB::rollBack();

                return ["status" => false, "error" => "name"];

            }else{

                $this->nome = $data["profile_name"];
                $this->acesso_geral = $data["access"];

                if($insert = $this->save()){

                    $createdProfileID = $this->id;

                    $model = new ProfileHasModuleModel();

                    $newRelationship = $model->newProfileRelationship($createdProfileID);

                    DB::commit();

                    return ["status" => true, "error" => false];

                }else{

                    DB::rollBack();

                    return ["status" => false, "error" => "generic"];

                }

            }  

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => "generic"];

        }

    }

    function loadAllProfiles() : array {

        try{

            DB::beginTransaction();

            if($returnedRecords = ProfileModel::all()){

                 DB::commit();

                 return ["status" => true, "error" => false, "data" => $returnedRecords];

            }else{

                DB::rollBack();

                return ["status" => false, "error" => true];

            }
                
                
        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => true];

        }


    }

    function updateProfile(int $profile_id, string $profile_name, array $profile_modules_relationship) : array {

        try{

            DB::beginTransaction();

            if(ProfileModel::where('nome', $profile_name)->where('id', '!=', $profile_id)->exists()){

                return ["status" => false, "error" => "name_already_exists"];

            }else{

                ProfileModel::where('id', $profile_id)->update(["nome" => $profile_name]);

                // O perfil teve seus dados básicos atualizados (tabela 'profile')
                // Agora é preciso atualizar a relação dele com os módulos (tabela 'profile_has_module')

                $model = new ProfileHasModuleModel();

                $profile_modules_relationship_update = $model->updateProfileModuleRelationship($profile_id, $profile_modules_relationship);

                if($profile_modules_relationship_update["status"] && !$profile_modules_relationship_update["error"]){

                    DB::commit();

                    return ["status" => true, "error" => false];

                }else if(!$profile_modules_relationship_update["status"] && $profile_modules_relationship_update["error"]){

                    
                    DB::rollBack();

                    return ["status" => false, "error" => true];

                }

            }

        }catch(\Exception $e){

            
            DB::rollBack();

            return ["status" => false, "error" => true];

        }

    }

    /**
     * Método realizar um DELETE em um registro especifico da tabela "profiles"
     *
     * @param int $userid
     * @return array
     */
    function deleteProfile(int $profileID) : array {

        try{

            DB::beginTransaction();

            $delete = ProfileModel::where('id', $profileID)->delete();

            if($delete){

                DB::commit();

                return ["status" => true, "error" => false];

            }else{

                DB::rollBack();

                return ["status" => false, "error" => true];

            }

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => true];

        }


    }


}
