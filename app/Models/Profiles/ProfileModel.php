<?php

namespace App\Models\Profiles;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\SoftDeletes;
// Custom
use App\Models\Pivot\ProfileHasModuleModel;
use  App\Models\User\UserModel;

class ProfileModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "profiles";
    protected $guarded=[];

    /*
    * Relationship with user table
    */
    function user(){

        return $this->hasMany("App\Models\User\UserModel", "profile_id");

    }

    /*
    * Relationship with profilehasmodule table
    */
    function module_privileges(){

        return $this->hasMany("App\Models\Pivot\ProfileHasModuleModel", "profile_id");

    }

    // ================================================ //

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

            DB::beginTransaction();

            ProfileModel::where('id', $profile_id)->update(["name" => $profile_name]);

            $model = new ProfileHasModuleModel();

            $model_response = $model->updateProfileModuleRelationship((int) $profile_id, $profile_modules_relationship);

            if($model_response["status"] && !$model_response["error"]){

                DB::commit();

                return ["status" => true, "error" => false];

            }else if(!$model_response["status"] && $model_response["error"]){

                DB::rollBack();

                return ["status" => false, "error" => $model_response["error"]];

            }

        }catch(\Exception $e){
            
            DB::rollBack();

            return ["status" => false, "error" => $e->getMessage()];

        }

    }
}
