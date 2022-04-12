<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

// Eventos utilizados
use  App\Events\UserSuccessfulLoginEvent;

// Model utilizado para os procedimentos
use App\Models\User\UserModel;
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;

class AuthenticationModel extends Model
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

                $user_account_data = UserModel::where('email', '=', $request->email)->get();

                if(password_verify($request->password, $user_account_data[0]->senha)){

                    $account_status = $this->checkUserStatus($user_account_data[0]);

                    if($account_status == "ACTIVE"){

                        $get_token_data = $this->getTokenData($request, $user_account_data);

                        if($get_token_data["status"] && !$get_token_data["error"]){

                            return ["status" => true, "error" => false, "token_data" => $get_token_data["token_data"]];
                        
                        }else if(!$get_token_data["status"] && $get_token_data["error"]){

                            return ["status" => true, "error" => $get_token_data["error"]];

                        }

                    }else if($account_status == "INATIVE"){

                        if($this->activateAccount((int) $user_account_data[0]->id, (string) $user_account_data[0]->email)){

                            if($get_token_data["status"] && !$get_token_data["error"]){

                                return ["status" => true, "error" => false, "token_data" => $get_token_data["token_data"]];
                            
                            }else if(!$get_token_data["status"] && $get_token_data["error"]){
    
                                return ["status" => true, "error" => $get_token_data["error"]];
    
                            }
                        
                        }else{

                            return ["status" => false, "error" => "activation"];

                        }

                    }else if($account_status == "DISABLED"){

                        return ["status" => false, "error" => "account_disabled"];

                    }

                // Se não, se as senhas foram incompátiveis 
                }else{

                    return ["status" => false, "error" => "password"];

                }

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];
            
        }

    }

    private function getTokenData($request, $user_account_data){

        $token_data_generation_response = $this->generateTokenJWTData($user_account_data[0]->id, $request->email, $user_account_data[0]->id_perfil);

        if($token_data_generation_response["status"] && !$token_data_generation_response["error"]){

            // Registrar um acesso com a classe de Evento
            UserSuccessfulLoginEvent::dispatch($user_account_data[0]);

            // Retornar os dados com uma resposta de sucesso
            return ["status" => true, "error"=>false, "token_data" => $token_data_generation_response["token_data"]];

        }else if(!$token_data_generation_response["status"] && $token_data_generation_response["error"]){

            //Retornar uma resposta de falha
            return ["status" => false, "error"=> "token_generation_failed"];

        }  

    }

    /**
     * Método para verificar o status do usuário
     * 
     * Usuário ativo: status é true e possui registro de acesso
     * Usuário inativo: status é false e não possui registro de acesso
     * Usuário desabilitado: status é false e possui registro de acesso
     * 
     * @param int $user_id
     * @return bool
     */
    private function checkUserStatus(object $user_account_data){

        if($user_account_data->status == true && $user_account_data->dh_ultimo_acesso != NULL){ 

            return "ACTIVE";

        }else if(!$user_account_data->status && $user_account_data->dh_ultimo_acesso === NULL){  

            return "INATIVE";

        }else if(!$user_account_data->status && $user_account_data->dh_ultimo_acesso != NULL){ 

            return "DISABLED";

        }

    }

    /**
     * Método para processar a ativação da conta
     * 
     * @param int $user_id
     * @return bool
     */
    private function activateAccount(int $user_id, string $user_email) : bool {

        try{
            
            DB::beginTransaction();

            if(UserModel::where('id', $user_id)->exists()){
    
                UserModel::where('id', $user_id)->update(['status' => true]);

                if($this->linkNewUserToSupplementalDataTables($user_id, $user_email)){

                    // Se a operação for bem sucedida, confirmar
                    DB::commit();
    
                    return true;

                }else{

                    DB::rollBack();

                    return false;

                }

            }else{

                DB::rollBack();
    
                return false;
    
            }  

        }catch(\Exception $e){

            DB::rollBack();
    
            return false;

        }

    }

    /**
     * Método para vincular o novo usuário ativado à tabela de dados complementares e de endereços
     * 
     * @param int $user_id
     * @return bool|object
     */
    private function linkNewUserToSupplementalDataTables(int $user_id, string $user_email) : bool {

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

            DB::table("users")->where('id', $user_id)->update(["id_dados_complementares" => $newCompDataID]); 
    
            return true;

        }catch(\Exception $e){

            return false;

        }
        

    }

    /**
     * Método para recuperar todos os dados relacionados ao usuário que está logando
     * Se for o Super-Admin serão buscados apenas os dados básicos
     * 
     * @param int $user_id
     * @return bool
     */
    private function generateTokenJWTData(int $user_id, string $user_email, int $user_profile) : array|bool {

        try{

            // Se o usuário que estiver logando for o "Super-Admin"
            if($user_email == env("SUPER_ADMIN_EMAIL") || $user_profile == 5){

                $token_data_generation_response = $this->generateTokenWithBasicData((int) $user_id);

            }else{

                $token_data_generation_response = $this->generateTokenWithAllData((int) $user_id);

            }

            return $token_data_generation_response;
            
        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    private function generateTokenWithBasicData(int $user_id) : array {

        try{

            // Query Builder para buscar os dados do usuário e do seu perfil
            $user_account_data = DB::table('users')
            ->join('profile', 'users.id_perfil', '=', 'profile.id')
            ->where('users.id', '=', $user_id)
            ->select('users.id', 'users.nome', 'users.email', 'users.status', 'users.id_perfil', 'profile.nome as nome_perfil', 'users.id_dados_complementares', 'users.dh_ultimo_acesso', 'users.dh_atualizacao', 'users.dh_criacao')
            ->get();

            // Dados para o token JWT simples
            $simpleTokenJWTData = array(
                "id" => $user_account_data[0]->id, 
                "name"=> $user_account_data[0]->nome,  
                "email"=> $user_account_data[0]->email, 
                "profile_id" => $user_account_data[0]->id_perfil,
                "profile" => $user_account_data[0]->nome_perfil,
                "complementary_data" => $user_account_data[0]->id_dados_complementares,
                "last_access" => $user_account_data[0]->dh_ultimo_acesso,
                "last_update" => $user_account_data[0]->dh_atualizacao
            );

            return ["status" => true, "error" => false, "token_data" => $simpleTokenJWTData];

        }catch(\Exception $e){

            return ["status" => true, "error" => $e->getMessage()];

        }

    }
    
    private function generateTokenWithAllData(int $user_id) : array {

        try{

            // Query Builder para buscar os dados do usuário e do seu perfil
        $user_account_data = DB::table('users')
        ->join('profile', 'users.id_perfil', '=', 'profile.id')
        ->join('user_complementary_data', 'users.id_dados_complementares', '=', 'user_complementary_data.id')
        ->join('address', 'user_complementary_data.id_endereco', '=', 'address.id')
        ->where('users.id', '=', $user_id)
        ->select(
            'users.id', 
            'users.nome', 
            'users.email', 
            'users.status', 
            'users.id_perfil',
            'users.id_dados_complementares', 
            'users.dh_ultimo_acesso', 
            'users.dh_atualizacao', 
            'users.dh_criacao',
            'profile.nome as nome_perfil',
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
            "id" => $user_account_data[0]->id, 
            "name"=> $user_account_data[0]->nome, 
            "email"=> $user_account_data[0]->email, 
            "profile_id" => $user_account_data[0]->id_perfil, 
            "profile" => $user_account_data[0]->nome_perfil,
            "user_complementary_data" => array(
                "complementary_data_id" => $user_account_data[0]->id_dados_complementares,
                "habANAC" => $user_account_data[0]->habANAC,
                "CPF" => $user_account_data[0]->CPF,
                "CNPJ" => $user_account_data[0]->CNPJ,
                "telephone" => $user_account_data[0]->telefone,
                "cellphone" => $user_account_data[0]->celular,
                "razaoSocial" => $user_account_data[0]->razaoSocial,
                "nomeFantasia" => $user_account_data[0]->nomeFantasia
            ),
            "user_address_data" => array(
                "user_address_id" => $user_account_data[0]->id_endereco,
                "logradouro" => $user_account_data[0]->logradouro,
                "numero" => $user_account_data[0]->numero,
                "cep" => $user_account_data[0]->cep,
                "cidade" => $user_account_data[0]->cidade,
                "estado" => $user_account_data[0]->estado,
                "complemento" => $user_account_data[0]->complemento
            ),
            "last_access" => $user_account_data[0]->dh_ultimo_acesso,
            "last_update" => $user_account_data[0]->dh_atualizacao
        );

        return ["status" => true, "error" => false, "token_data" => $advancedTokenJWTData];

        }catch(\Exception $e){

            return ["status" => true, "error" => $e->getMessage()];

        }

    }
}
