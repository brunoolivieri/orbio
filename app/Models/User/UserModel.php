<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Auth\User as Authenticatable;
// Custom Models
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;
use App\Models\ProfileAndModule\ProfileHasModuleModel;
use App\Models\ProfileAndModule\ProfileModel;
// Custom Emails
use App\Mail\UserRegisteredEmail;
// Log
use Illuminate\Support\Facades\Log;

use Database\Factories\UserFactory;

class UserModel extends Authenticatable
{
    use HasFactory;

    protected $table = "users";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";
    protected $fillable = ["*"];

    // For Auth:: works
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

    /**
     * Distant relationship with address table through user_complementary_data table
     */
    function address()
    {
        return $this->hasOneThrough(UserAddressModel::class, UserComplementaryDataModel::class, "id_endereco");
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
    function createUser(array $data, string $unencrypted_password) : array {

        try{ 

            UserModel::insert($data);

            // Envio do email com os dados de acesso para o novo usuário
            Mail::to($data["email"])->send(new UserRegisteredEmail([
                "name" => $data["nome"],
                "email" => $data["email"],
                "password" => $unencrypted_password
            ]));

            Log::channel('mail')->info("[Método: createUser][Model: UserModel] - Dados de acesso do novo usuário enviados com sucesso - Destinatário: ".$data["email"]);

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
     * Método realizar um SELECT COM WHERE na tabela "users"
     * Traz todos os dados vinculados a um usuário
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadAllUserData(int $user_id) : array {

        try{

            $data = DB::table('users')
            ->join('user_complementary_data', 'users.id_dados_complementares', '=', 'user_complementary_data.id')
            ->join('address', 'user_complementary_data.id_endereco', '=', 'address.id')
            ->where('users.id', '=', $user_id)
            ->select(
                'users.nome', 
                'users.email', 
                'users.senha',
                'user_complementary_data.habANAC',
                'user_complementary_data.CPF',
                'user_complementary_data.CNPJ',
                'user_complementary_data.telefone',
                'user_complementary_data.celular',
                'user_complementary_data.razaoSocial',
                'user_complementary_data.nomeFantasia',
                'address.logradouro',
                'address.numero',
                'address.cep',
                'address.cidade',
                'address.estado',
                'address.complemento'     
                )
            ->get();

            return ["status" => true, "error" => false, "account_data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
