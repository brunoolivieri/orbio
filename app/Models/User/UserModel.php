<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

// Email
use App\Mail\UserRegisteredEmail;

class UserModel extends Model
{
    use HasFactory;

    protected $table = "users";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";
    protected $fillable = ["*"];

    /**
     * Método realizar um INSERT na tabela "users"
     *
     * @param array $data
     * @return array
     */
    function createUserAndSendAccessData(array $data, string $unencrypted_password) : array {

        try{

            if(UserModel::where('email', $data["email"])->exists()){

                return ["status" => false, "error" => "email_already_exists"];

            }else{

                DB::beginTransaction();

                UserModel::insert($data);

                // Envio do email com os dados de acesso para o novo usuário
                Mail::to($data["email"])->send(new UserRegisteredEmail([
                    "name" => $data["nome"],
                    "email" => $data["email"],
                    "password" => $unencrypted_password
                ]));

                DB::Commit();

                return ["status" => true, "error" => false];

            }  

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Método realizar um SELECT SEM WHERE na tabela "users"
     * Os registros selecionados preencherão uma única página da tabela
     * A quantidade por página é definida pelo LIMIT, e o número da página pelo OFFSET
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadAllUsers(int $offset, int $limit) : array {

        try{

            // Query Builder para fazer o relacionamento
            $allUsers = DB::table('users')
            ->join('profile', 'users.id_perfil', '=', 'profile.id')
            ->select('users.id', 'users.nome', 'users.email', 'users.id_perfil', 'profile.nome as nome_perfil' , 'users.status', 'users.dh_criacao', 'users.dh_atualizacao', 'users.dh_ultimo_acesso')
            ->offset($offset)->limit($limit)->orderBy('users.id')->get();

            if($allUsers){

                // A paginação é criada com base no total de registros por página. Com LIMIT 10 e 30 registros, serão 3 páginas com 10 registros cada.
                // Portanto esse valor, do total de registros existentes, é necessário
                $totalTableRecords = UserModel::all()->count();

                $response = [
                    "referencialValueForCalcPages" => $totalTableRecords,
                    "selectedRecords" => $allUsers
                ];

                return ["status" => true, "error" => false, "data" => $response];

            }

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Método realizar um SELECT COM WHERE na tabela "users"
     *
     * @param int $offset
     * @param int $limit
     * @return array
     */
    function loadSpecificUsers(string $value_searched, int $offset, int $limit) : array {

        try{

            $searchedUsers = DB::table('users')
            ->join('profile', 'users.id_perfil', '=', 'profile.id')
            ->select('users.id', 'users.nome', 'users.email', 'users.id_perfil', 'profile.nome as nome_perfil' , 'users.status', 'users.dh_criacao', 'users.dh_atualizacao', 'users.dh_ultimo_acesso')
            ->where('users.id', $value_searched)
            ->orWhere('users.nome', 'LIKE', '%'.$value_searched.'%')
            ->orWhere('users.email', 'LIKE', '%'.$value_searched.'%')
            ->offset($offset)->limit($limit)->orderBy('users.id')->get();

            if($searchedUsers){

                $response = [
                    "referencialValueForCalcPages" => count($searchedUsers),
                    "selectedRecords" => $searchedUsers
                ];

                return ["status" => true, "error" => false, "data" => $response];

            }

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
    
    /**
     * Método realizar um UPDATE em um registro especifico da tabela "users"
     *
     * @param int $userid
     * @return array
     */
    function updateUserDataAndSendNotificationEmail(int $user_id, array $data) : array {

        try{

            if(UserModel::where('email', $data["email"])->where('id', '!=', $user_id)->exists()){

                return ["status" => false, "error" => "email_already_exists"];
                
            }else{

                UserModel::where('id', $user_id)->update($data);

                // Notificar usuário
                /*Mail::to($data["email"])->send(new UserRegisteredEmail([
                    "name" => $data["nome"],
                    "email" => $data["email"],
                    "password" => $unencrypted_password
                ]));*/

                return ["status" => true, "error" => false];

            }

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    /**
     * Método realizar um DELETE em um registro especifico da tabela "users"
     *
     * @param int $userID
     * @return array
     */
    function deleteUser(int $user_id) : array {

        try{

            UserModel::where('id', $user_id)->delete();

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }
    


}
