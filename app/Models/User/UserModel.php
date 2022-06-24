<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
// Custom Models
use App\Models\Profiles\ProfileModel;
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;
use App\Models\Pivot\ProfileHasModuleModel;
use App\Mail\User\SendAccessDataToCreatedUser;
use Database\Factories\UserFactory;

class UserModel extends Authenticatable
{
    use HasFactory, SoftDeletes;

    protected $table = "users";
    protected $fillable = ["*"];

    /*
    * Relationship with user_complementary_data table
    */
    function complementary_data(){
        return $this->belongsTo("App\Models\User\UserComplementaryDataModel", "complementary_data_id");
    }

    /*
    * Relationship with sessions table
    */
    function sessions(){
        return $this->hasMany("App\Models\SessionModel", "user_id");
    }

    /*
    * Relationship with profile table
    */
    function profile(){
        return $this->belongsTo("App\Models\Profiles\ProfileModel", "profile_id");
    }

     /**
     * Distant relationship with profile_has_module table through profile table
     */
    function profile_modules_relationship(){
        return $this->hasManyThrough(ProfileHasModuleModel::class, ProfileModel::class);
    }

    /*
    * Relationship with service_order_has_user table
    */
    function service_order_has_user(){
        return $this->hasMany("App\Models\Orders\ServiceOrderHasUserModel", "user_id");
    }

    /**
     * Factory that uses this model for generate random users
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory() : \Illuminate\Database\Eloquent\Factories\Factory
    {
        return UserFactory::new();
    }

    // ================================================ //

    /**
     * Get all user data.
     *
     * @param int $user_id
     * @return array
     */
    function loadAllUserData(int $user_id) : array {

        try{

            $user = UserModel::find($user_id);

            $data = [
                "basic" => [
                    'name' => $user->name, 
                    'email' => $user->email 
                ],
                "complementary" => [
                    'anac_license' => $user->complementary_data->habANAC,
                    'cpf' => $user->complementary_data->CPF,
                    'cnpj' => $user->complementary_data->CNPJ,
                    'telefone' => $user->complementary_data->telephone,
                    'celular' => $user->complementary_data->cellphone,
                    'company_name' => $user->complementary_data->company_name,
                    'trading_name' => $user->complementary_data->trading_name
                ],
                "address" => [
                    'address' => $user->complementary_data->address->address,
                    'number' => $user->complementary_data->address->number,
                    'cep' => $user->complementary_data->address->cep,
                    'city' => $user->complementary_data->address->city,
                    'state' => $user->complementary_data->address->state,
                    'complement' => $user->complementary_data->address->complement
                ]    
            ];

            return ["status" => true, "error" => false, "account_data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
