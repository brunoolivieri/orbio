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
// Custom Models
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;
use App\Models\ProfileAndModule\ProfileHasModuleModel;
use App\Models\ProfileAndModule\ProfileModel;
// Custom Emails
use App\Mail\User\SendAccessDataToCreatedUser;
// Log
use Illuminate\Support\Facades\Log;
// Factory
use Database\Factories\UserFactory;

class UserModel extends Authenticatable
{
    use HasFactory, SoftDeletes;

    protected $table = "users";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";
    protected $fillable = ["*"];

    // For Auth::attempt works
    function getAuthPassword() {
        return $this->senha;
    }

    /*
    * Relationship with user_complementary_data table
    */
    function complementary_data(){
        return $this->belongsTo("App\Models\User\UserComplementaryDataModel", "id_dados_complementares");
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
        return $this->belongsTo("App\Models\ProfileAndModule\ProfileModel", "id_perfil");
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
        return $this->hasMany("App\Models\Orders\ServiceOrderHasUserModel", "id_usuario");
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

                // Envio do email de registro para o novo usuário
                Mail::to($new_user_data->email)->send(new SendAccessDataToCreatedUser([
                    "name" =>  $new_user_data->nome,
                    "email" =>  $new_user_data->email,
                    "profile" =>  $new_user_data->profile->nome,
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
            ->join('profile', 'users.id_perfil', '=', 'profile.id')
            ->select('users.id', 'users.nome', 'users.email', 'users.id_perfil', 'profile.nome as nome_perfil' , 'users.status', 'users.dh_criacao', 'users.dh_atualizacao', 'users.dh_ultimo_acesso')
            ->where("users.deleted_at", null)
            ->when($where_value, function ($query, $where_value) {

                $query->when(is_numeric($where_value), function($query) use ($where_value){

                    $query->where('users.id', $where_value);

                }, function($query) use ($where_value){

                    $query->where('users.nome', 'LIKE', '%'.$where_value.'%')->orWhere('users.email', 'LIKE', '%'.$where_value.'%');

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
                'nome' => $user->nome, 
                'email' => $user->email, 
                'habANAC' => $user->complementary_data->habANAC,
                'CPF' => $user->complementary_data->CPF,
                'CNPJ' => $user->complementary_data->CNPJ,
                'telefone' => $user->complementary_data->telefone,
                'celular' => $user->complementary_data->celular,
                'razaoSocial' => $user->complementary_data->razaoSocial,
                'nomeFantasia' => $user->complementary_data->nomeFantasia,
                'logradouro' => $user->complementary_data->address->logradouro,
                'numero' => $user->complementary_data->address->numero,
                'cep' => $user->complementary_data->address->cep,
                'cidade' => $user->complementary_data->address->cidade,
                'estado' => $user->complementary_data->address->estado,
                'complemento' => $user->complementary_data->address->complemento
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
                    "logradouro" => NULL,
                    "numero" => NULL,
                    "cep" => NULL,
                    "cidade" => NULL,
                    "estado" => NULL,
                    "complemento" => NULL
                ]
            );

            $new_comp_data_id = DB::table("user_complementary_data")->insertGetId([
                "habANAC" => NULL,
                "CPF" => NULL,
                "CNPJ" => NULL,
                "telefone" => NULL,
                "celular" => NULL,
                "razaoSocial" => NULL,
                "nomeFantasia" => NULL,
                "id_endereco" => $new_address_id
            ]);

            UserModel::where('id', Auth::user()->id)->update(["id_dados_complementares" => $new_comp_data_id]);

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            Log::channel('login_error')->error("[Acesso negado | Ativação da conta falhou] - ID do usuário: ".Auth::user()->id." | Email:".Auth::user()->email."| Erro: ".$e->getMessage());

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
