<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

// Eventos utilizados
use  App\Events\UserSuccessfulLoginEvent;

// Model utilizado para os procedimentos
use App\Models\User\UserModel;
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;



class UserAuthenticationOperationsModel extends Model
{
    use HasFactory;

    /**
     * Método para processar o login
     * Existem 3 casos para uma combinação email e senha válidos
     * Se a conta estiver ativa e tiver registro de acesso, o acesso é concedido
     * Se a conta estiver inativa e não tiver registro de acesso, ela é ativada e o acesso é concedido
     * Se a conta estiver inativa e tiver registro e acesso, ela está desabilitada e o acesso é negado
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function userAuthentication($request) {

        try{

        // Se o usuário existir 
        if(UserModel::where('email', $request->email)->exists()){

            $userAccountData = UserModel::where('email', '=', $request->email)->get();

            // Se a senha informada for compátivel com a do registro
            if(password_verify($request->password, $userAccountData[0]->senha)){

                // Se o status dele for true e se já tiver acessado a conta alguma vez
                if($userAccountData[0]->status == true && $userAccountData[0]->dh_ultimo_acesso != NULL){

                    // Registrar um acesso com a classe de Evento
                    if(UserSuccessfulLoginEvent::dispatch($userAccountData[0])){

                        if($tokenData = $this->generateTokenJWTData($userAccountData[0]->id, $request->email)){

                            // O Super-Admin não tem acesso a seção de gerenciamento dos dados da conta
                            // A senha é utilizada na seção da conta para que o usuário possa edita-la a partir de dentro do sistema
                            // MD5 é revertido para o valor original ao ser utilizado como valor default do input da senha na seção da conta do usuário
                            $tokenData["senha"] = $request->email == "SUPER_ADMIN_EMAIL" ? "" : $request->password;

                            // Retornar os dados com uma resposta de sucesso
                            return ["status" => true, "error"=>false, "data" => $tokenData];

                        }else{

                            //Retornar uma resposta de falha
                            return ["status" => false, "error"=> "token_generation_failed"];

                        }

                    // Se o campo do último acesso não for atualizado
                    }else{

                        //Retornar uma resposta de falha
                        return ["status" => false, "error" => "last_access_field_update_failed"];

                    } 
                
                // Se não, se o seu status for false e ele não tiver acessado a conta
                }else if(!$userAccountData[0]->status && $userAccountData[0]->dh_ultimo_acesso === NULL){

                    // A conta será ativada 
                    // Se a ativação for um sucesso
                    if($this->accountActivation((int) $userAccountData[0]->id, (string) $userAccountData[0]->email)){

                        // Registrar um acesso com a classe de Evento
                        if(UserSuccessfulLoginEvent::dispatch($userAccountData[0])){

                            if($tokenData = $this->generateTokenJWTData($userAccountData[0]->id, $userAccountData[0]->email)){

                                // Retornar os dados com uma resposta de sucesso
                                return ["status" => true, "error"=>false, "data" => $tokenData];

                            }else{

                                //Retornar uma resposta de falha
                                return ["status" => false, "error"=> "token_generation_failed"];

                            }
                            
                        // Se o campo do último acesso não for atualizado
                        }else{

                            //Retornar uma resposta de falha
                            return ["status" => false, "error"=> "last_access_field_update_failed"];

                        }
                    
                    // Se a ativação falhar
                    }else{

                        // Retornar uma resposta de falha do tipo "activation"
                        return ["status" => false, "error" => "activation"];

                    }
                
                // Se não, se o status for false e já tiver sido acessada
                }else if(!$userAccountData[0]->status && $userAccountData[0]->dh_ultimo_acesso != NULL){

                    // Retornar uma resposta de falha do tipo "activation"
                    return ["status" => false, "error" => "account_disabled"];

                }

            // Se não, se as senhas foram incompátiveis 
            }else{

                // Retornar uma resposta de falha, do tipo "password"
                return ["status" => false, "error" => "password"];

            }

        // Se não, se o usuário não existir
        }else{

            // Retornar uma resposta de falha, do tipo "email"
            return ["status" => false, "error" => "email_not_exists"];

        }

    }catch(\Exception $e){

        dd($e);

    }

    }

    /**
     * Método para processar a ativação da conta
     * 
     * @param int $userID
     * @return bool
     */
    private function accountActivation(int $userID, string $user_email) : bool {

        try{

            // Inicialização da transação
            DB::beginTransaction();
    
            $count = UserModel::where('id', $userID)->count();

            if($count === 1){
    
                if(UserModel::where('id', $userID)->update(['status' => true])){

                    if($this->userGenerateComplementaryData($userID, $user_email)){

                        // Se a operação for bem sucedida, confirmar
                        DB::commit();
        
                        return true;

                    }else{

                        // Se a operação falhar, desfazer as transações
                        DB::rollBack();

                        return false;

                    }

                }else{

                    // Se a operação falhar, desfazer as transações
                    DB::rollBack();
    
                    return false;
    
                }      
    
            }else{

                // Se a operação falhar, desfazer as transações
                DB::rollBack();
    
                return false;
    
            }  

        }catch(\Exception $e){

            // INSERIR NO ARQUIVO DE LOG

            // Se a operação falhar, desfazer as transações
            DB::rollBack();
    
            return false;

        }

    }

    /**
     * Método para vincular o novo usuário à tabela de dados complementares e de endereços
     * 
     * @param int $userID
     * @return bool|object
     */
    private function userGenerateComplementaryData(int $userID, string $user_email) : bool {

        try{

            $newAddressID = DB::table("address")->insertGetId(
                [
                    "logradouro" => NULL,
                    "numero" => NULL,
                    "cep" => NULL,
                    "cidade" => NULL,
                    "estado" => NULL,
                    "complemento" => NULL
                ]
            );
    
            $newCompDataID = DB::table("user_complementary_data")->insertGetId([
                "habANAC" => NULL,
                "CPF" => NULL,
                "CNPJ" => NULL,
                "telefone" => NULL,
                "celular" => NULL,
                "razaoSocial" => NULL,
                "nomeFantasia" => NULL,
                "id_endereco" => $newAddressID
            ]);

            DB::table("users")->where('id', $userID)->update(["id_dados_complementares" => $newCompDataID]); 
    
            return true;

        }catch(\Exception $e){

            return false;

        }
        

    }

    /**
     * Método para recuperar todos os dados relacionados ao registro do usuário
     * Os dados vinculados ao usuário, além da tabela "profile", só existem se o usuário não for o Super-Admin
     * Esses dados complementares que são obtidos para os restantes usuários, vêm de 2 tabelas: "user_complementary_data" e "Address"
     * 
     * @param int $userID
     * @return bool
     */
    private function generateTokenJWTData(int $userID, string $user_email) : array|bool {

        try{

            // Se o usuário que estiver logando for o "Super-Admin"
            if($user_email == env("SUPER_ADMIN_EMAIL")){

                // Query Builder para buscar os dados do usuário e do seu perfil
                $userAccountData = DB::table('users')
                ->join('profile', 'users.id_perfil', '=', 'profile.id')
                ->where('users.id', '=', $userID)
                ->select('users.id', 'users.nome', 'users.email', 'users.senha', 'users.status', 'users.id_perfil', 'profile.nome as nome_perfil', 'profile.acesso_geral', 'users.id_dados_complementares', 'users.dh_ultimo_acesso', 'users.dh_atualizacao', 'users.dh_criacao')
                ->get();

                // Dados para o token JWT simples
                $simpleTokenJWTData = array(
                    "id" => $userAccountData[0]->id, 
                    "name"=> $userAccountData[0]->nome,  
                    "email"=> $userAccountData[0]->email, 
                    "profile_id" => $userAccountData[0]->id_perfil, 
                    "general_access" => $userAccountData[0]->acesso_geral,
                    "profile" => $userAccountData[0]->nome_perfil,
                    "complementary_data" => $userAccountData[0]->id_dados_complementares,
                    "last_access" => $userAccountData[0]->dh_ultimo_acesso,
                    "last_update" => $userAccountData[0]->dh_atualizacao
                );

                return $simpleTokenJWTData;

            }else{

                // Query Builder para buscar os dados do usuário e do seu perfil
                $userAccountData = DB::table('users')
                ->join('profile', 'users.id_perfil', '=', 'profile.id')
                ->join('user_complementary_data', 'users.id_dados_complementares', '=', 'user_complementary_data.id')
                ->join('address', 'user_complementary_data.id_endereco', '=', 'address.id')
                ->where('users.id', '=', $userID)
                ->select(
                    'users.id', 
                    'users.nome', 
                    'users.email', 
                    'users.senha', 
                    'users.status', 
                    'users.id_perfil',
                    'users.id_dados_complementares', 
                    'users.dh_ultimo_acesso', 
                    'users.dh_atualizacao', 
                    'users.dh_criacao',
                    'profile.nome as nome_perfil', 
                    'profile.acesso_geral',
                    'user_complementary_data.habANAC',
                    'user_complementary_data.CPF',
                    'user_complementary_data.CNPJ',
                    'user_complementary_data.telefone',
                    'user_complementary_data.celular',
                    'user_complementary_data.razaoSocial',
                    'user_complementary_data.nomeFantasia',
                    'address.id as id_endereco',
                    'address.logradouro',
                    'address.numero',
                    'address.cep',
                    'address.cidade',
                    'address.estado',
                    'address.complemento'
                    )
                ->get();

                // Dados para o token JWT avançado
                $advancedTokenJWTData = array(
                    "id" => $userAccountData[0]->id, 
                    "name"=> $userAccountData[0]->nome, 
                    "email"=> $userAccountData[0]->email, 
                    "profile_id" => $userAccountData[0]->id_perfil, 
                    "general_access" => $userAccountData[0]->acesso_geral,
                    "profile" => $userAccountData[0]->nome_perfil,
                    "user_complementary_data" => array(
                        "complementary_data_id" => $userAccountData[0]->id_dados_complementares,
                        "habANAC" => $userAccountData[0]->habANAC,
                        "CPF" => $userAccountData[0]->CPF,
                        "CNPJ" => $userAccountData[0]->CNPJ,
                        "telephone" => $userAccountData[0]->telefone,
                        "cellphone" => $userAccountData[0]->celular,
                        "razaoSocial" => $userAccountData[0]->razaoSocial,
                        "nomeFantasia" => $userAccountData[0]->nomeFantasia
                    ),
                    "user_address_data" => array(
                        "user_address_id" => $userAccountData[0]->id_endereco,
                        "logradouro" => $userAccountData[0]->logradouro,
                        "numero" => $userAccountData[0]->numero,
                        "cep" => $userAccountData[0]->cep,
                        "cidade" => $userAccountData[0]->cidade,
                        "estado" => $userAccountData[0]->estado,
                        "complemento" => $userAccountData[0]->complemento
                    ),
                    "last_access" => $userAccountData[0]->dh_ultimo_acesso,
                    "last_update" => $userAccountData[0]->dh_atualizacao
                );

                return $advancedTokenJWTData;

            }
            
        }catch(\Exception $e){

            return false;

        }

    }

    /**
     * Método para processar o envio do código para alteração da senha
     * 
     * @param object $request
     * @return \Illuminate\Http\Response
     */
    function userSendCodeForChangePassword(object $request){

        try{

            // Inicialização da transação
            DB::beginTransaction();

            $checkIfExists = UserModel::where('email', $request->email)->where('status', true)->exists();

            if($checkIfExists){

                $token = random_int(1000, 9999);

                $response = UserModel::where('email', $request->email)->update(['token' => $token]);

                if($response){

                    // Se a operação for bem sucedida, confirmar
                    DB::commit();

                    return response($token, 200);

                }else{

                    // Se a operação falhar, desfazer as transações
                    DB::rollBack();

                    return response("", 500);

                }  

            }else{

                // Se a operação falhar, desfazer as transações
                DB::rollBack();

                return response("email", 500);

            }

        }catch(\Exception $e){

            // INSERIR NO ARQUIVO DE LOG

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            return response("", 500);

        }


    }

    /**
     * Método para processar a alteração da senha
     * 
     * @param object $request
     * @return \Illuminate\Http\Response
     */
    function userChangePassword($request){

        try{

            // Inicialização da transação
            DB::beginTransaction();

            $count = UserModel::where('token', $request->token)->count();

            if($count === 1){

                $newPassword = password_hash($request->newPassword, PASSWORD_DEFAULT);

                $response = UserModel::where('token', $request->token)->update(['senha' => $newPassword]);

                if($response){

                    // Se a operação for bem sucedida, confirmar
                    DB::commit();

                    return response("", 200);

                }else{

                    // Se a operação falhar, desfazer as transações
                    DB::rollBack();

                    return response("", 500);

                }

            }else{

                // Se a operação falhar, desfazer as transações
                DB::rollBack();

                return response("code", 404);

            }

        }catch(\Exception $e){

            // INSERIR NO ARQUIVO DE LOG

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            return response("", 500);

        }

    }
}
