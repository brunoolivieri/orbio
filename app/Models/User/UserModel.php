<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserModel extends Model
{
    use HasFactory;

    protected $table = "users";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";

    /**
     * Método realizar um INSERT na tabela "users"
     *
     * @param array $data
     * @return array
     */
    function newUser(array $data) : array {

        try{

            // Inicialização da transação
            DB::beginTransaction();

            // Contador: verificar se o email já existe no banco de dados
            $checkIfExists = UserModel::where('email', $data["email"])->exists();

            if($checkIfExists){

                // Se a operação falhar, desfazer as transações
                DB::rollBack();

                // Erro do tipo "email já existe"
                return ["status" => false, "error" => "email_already_exists"];

            }else{

                $this->nome = $data["name"];
                $this->email = $data["email"];
                $this->senha = $data["password"];
                $this->id_perfil = $data["profile_type"];

                // Se a inserção na tabela "users" for bem sucedida
                if($insert = $this->save()){

                    // Log da operação realizada
                    Log::channel("registration")->info("Registro de usuário realizado com sucesso. Dados: [ID do Novo Usuário: {$this->id}]");

                    // Se a operação for bem sucedida, confirmar
                    DB::commit();

                    // Retornar Status 200 com o ID da inserção
                    return ["status" => true, "error" => false];

                }else{

                    // Se a operação falhar, desfazer as transações
                    DB::rollBack();

                    // Retornar resposta com erro do tipo "genérico"
                    return ["status" => false, "error" => true];

                }

            }  

        }catch(\Exception $e){

            echo $e;

            // Log do erro
            Log::channel("registration")->error("Falha no registro de usuário. Erro: ".$e);

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            // Retornar resposta com erro do tipo "genérico"
            return ["status" => false, "error" => true];

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

            // Inicialização da transação
            DB::beginTransaction();

            // Query Builder para fazer o relacionamento
            $allUsers = DB::table('users')
            ->join('profile', 'users.id_perfil', '=', 'profile.id')
            ->select('users.id', 'users.nome', 'users.email', 'users.id_perfil', 'profile.nome as nome_perfil' , 'users.status', 'users.dh_criacao', 'users.dh_atualizacao', 'users.dh_ultimo_acesso')
            ->offset($offset)->limit($limit)->get();

            if($allUsers){

                // Os registros serão usados para preencher a tabela de usuários, certo?
                // Certo. E a paginação é criada com base no total de registros por página. Com LIMIT 10 e 30 registros, serão 3 páginas com 10 registros cada.
                // Portanto esse valor, do total de registros existentes, é necessário
                $totalTableRecords = UserModel::all()->count();

                $response = [
                    "referencialValueForCalcPages" => $totalTableRecords,
                    "selectedRecords" => $allUsers
                ];

                // Se a operação for bem sucedida, confirmar
                DB::commit();

                return ["status" => true, "error" => false, "data" => $response];

            }

        }catch(\Exception $e){

            // Log do erro
            Log::channel("internal")->error("Falha no carregamento dos usuários. Erro: ".$e);

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            // Erro do tipo "email já existe"
            return ["status" => false, "error" => true];

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

        $total_search_compatible_records = UserModel::select('id', 'nome', 'email', 'id_perfil', 'status', 'dh_criacao', 'dh_atualizacao', 'dh_ultimo_acesso')
        ->where('id', $value_searched)->orWhere('nome', 'LIKE', '%'.$value_searched.'%')->orWhere('email', 'LIKE', '%'.$value_searched.'%')->offset($offset)->limit($limit)->count();

        try{

            // Inicialização da transação
            DB::beginTransaction();

            // Query Builder para fazer o relacionamento
            $searchedUsers = DB::table('users')
            ->join('profile', 'users.id_perfil', '=', 'profile.id')
            ->select('users.id', 'users.nome', 'users.email', 'users.id_perfil', 'profile.nome as nome_perfil' , 'users.status', 'users.dh_criacao', 'users.dh_atualizacao', 'users.dh_ultimo_acesso')
            ->where('users.id', $value_searched)
            ->orWhere('users.nome', 'LIKE', '%'.$value_searched.'%')
            ->orWhere('users.email', 'LIKE', '%'.$value_searched.'%')
            ->offset($offset)->limit($limit)->get();

            if($searchedUsers){

                $response = [
                    "referencialValueForCalcPages" => $total_search_compatible_records,
                    "selectedRecords" => $searchedUsers
                ];

                // Se a operação for bem sucedida, confirmar
                DB::commit();

                // Erro do tipo "email já existe"
                return ["status" => true, "error" => false, "data" => $response];

            }

        }catch(\Exception $e){

            // Log do erro
            Log::channel("internal")->error("Falha no carregamento do usuário. Erro: ".$e);

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            // Erro do tipo "email já existe"
            return ["status" => false, "error" => true];

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

            // Inicialização da transação
            DB::beginTransaction();

            $data = DB::table('users')
            ->join('user_complementary_data', 'users.id_dados_complementares', '=', 'user_complementary_data.id')
            ->join('address', 'user_complementary_data.id_endereco', '=', 'address.id')
            ->where('users.id', '=', $user_id)
            ->select(
                'users.nome', 
                'users.email', 
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

            // Log do erro
            Log::channel("internal")->error("Falha no carregamento dos dados da conta do usuário. Dados: [ID do Usuário: $user_id]. Erro: ".$e);

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            return ["status" => false, "error" => true];

        }

    }
    
    /**
     * Método realizar um UPDATE em um registro especifico da tabela "users"
     *
     * @param int $userid
     * @return array
     */
    function updateUserData(int $id, array $data) : array {

        try{

            // Inicialização da transação
            DB::beginTransaction();

            // Se já existe um Usuário com o email informado
            if(UserModel::where('email', $data["email"])->where('id', '!=', $id)->exists()){

                // Erro do tipo "email já existe"
                return ["status" => false, "error" => "email_already_exists"];
                
            }else{

                $update = UserModel::where('id', $id)->update($data);

                if($update){

                    // Log da operação realizada
                    Log::channel("internal")->info("Atualização de usuário realizada com sucesso. Dados: [ID do Usuário: $id]");

                    // Se a operação for bem sucedida, confirmar
                    DB::commit();

                    return ["status" => true, "error" => false];

                }else{

                    // Se a operação falhar, desfazer as transações
                    DB::rollBack();

                    return ["status" => false, "error" => true];

                }

            }

        }catch(\Exception $e){

            // Log do erro
            Log::channel("internal")->error("Falha na atualização do usuário. Dados: [ID do Usuário: $id]. Erro: ".$e);

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            return ["status" => false, "error" => true];

        }

    }

    /**
     * Método realizar um UPDATE em um registro especifico da tabela "users"
     *
     * @param int $userID
     * @return array
     */
    function deleteUser(int $userID) : array {

        try{

            // Inicialização da transação
            DB::beginTransaction();

            $delete = UserModel::where('id', $userID)->delete();

            if($delete){

                // Log da operação realizada
                Log::channel("internal")->info("Deleção de usuário realizada com sucesso. Dados: [ID do Usuário: $userID]");

                // Se a operação for bem sucedida, confirmar
                DB::commit();

                return ["status" => true, "error" => false];

            }else{

                // Se a operação falhar, desfazer as transações
                DB::rollBack();

                return ["status" => false, "error" => true];

            }

        }catch(\Exception $e){

            // Log do erro
            Log::channel("internal")->error("Falha na deleção do usuário. Dados: [ID do Usuário: $userID]. Erro: ".$e);

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            return ["status" => false, "error" => true];

        }

    }
    


}
