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

    /*// For Auth::attempt works
    function getAuthPassword() {
        return $this->senha;
    }*/

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
     * Create User and send access data for his email
     *
     * @param array $data
     * @return array
     */
    function createUserAndSendEmail(array $data, string $unencrypted_password) : array {

        try{ 

            DB::transaction(function () use ($data, $unencrypted_password) {

                $new_user_id = DB::table("users")->insertGetId($data);

                $new_user_data = UserModel::find($new_user_id);

                Mail::to($new_user_data->email)->send(new SendAccessDataToCreatedUser([
                    "name" =>  $new_user_data->name,
                    "email" =>  $new_user_data->email,
                    "profile" =>  $new_user_data->profile->name,
                    "unencrypted_password" => $unencrypted_password
                ]));

                Log::channel('mail')->info("[Método: createUser][Model: UserModel] - Dados de acesso do novo usuário enviados com sucesso - Destinatário: ".$data["email"]);

            });

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Carrega os registros no formato de paginação
     * A claúsula where é opcional
     * A claúsula when() permite criar queries condicionais
     *
     * @param array $data
     * @return array
     */
    function loadUsersWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{

            $data = DB::table('users')
            ->join('profiles', 'users.profile_id', '=', 'profiles.id')
            ->select('users.id', 'users.name', 'users.email', 'users.profile_id', 'profiles.name as profile_name' , 'users.status', 'users.created_at', 'users.updated_at', 'users.last_access')
            ->where("users.deleted_at", null)
            ->when($where_value, function ($query, $where_value) {

                $query->when(is_numeric($where_value), function($query) use ($where_value){

                    $query->where('users.id', $where_value);

                }, function($query) use ($where_value){

                    $query->where('users.name', 'LIKE', '%'.$where_value.'%')->orWhere('users.email', 'LIKE', '%'.$where_value.'%');

                });

            })->orderBy('users.id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);
            
            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

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

    function accountActivation() : array {

        try{

            UserModel::where("id", Auth::user()->id)->update(["status" => 1]);

            $new_address_id = DB::table("address")->insertGetId(
                [
                    "address" => null,
                    "number" => null,
                    "cep" => null,
                    "city" => null,
                    "state" => null,
                    "complement" => null
                ]
            );

            $new_comp_data_id = DB::table("user_complementary_data")->insertGetId([
                "anac_license" => null,
                "CPF" => null,
                "CNPJ" => null,
                "telephone" => null,
                "cellphone" => null,
                "company_name" => null,
                "trading_name" => null,
                "address_id" => $new_address_id
            ]);

            UserModel::where('id', Auth::user()->id)->update(["complementary_data_id" => $new_comp_data_id]);

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            Log::channel('login_error')->error("[Acesso negado | Ativação da conta falhou] - ID do usuário: ".Auth::user()->id." | Email:".Auth::user()->email."| Erro: ".$e->getMessage());

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
