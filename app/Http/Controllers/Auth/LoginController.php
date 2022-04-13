<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use App\User;

// Models utilizados
use App\Models\Auth\AuthenticationModel;
use App\Models\ProfileAndModule\ProfileHasModuleModel;
use App\Models\User\UserModel;

// Eventos utilizados
use  App\Events\GenerateTokenAndSessionEvent;

// Token JWT - https://github.com/firebase/php-jwt - https://www.youtube.com/watch?v=B-7e-ZpIWAs 
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Form Requests
use App\Http\Requests\Auth\Login\LoginRequest;

class LoginController extends Controller
{
    
    /**
     * Método para processar o login
     * Se for a primeira vez que é realizado, a conta também é ativada no processo
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function index(LoginRequest $request)  {

        // Password is converted to "senha" - this is defined in the model "UserModel"
        if($user = Auth::attempt(['email' => $request->email, 'password' => $request->password])){

            // User account is active
            if(Auth::user()->status && !empty(Auth::user()->dh_ultimo_acesso)){

                $token_data = $this->gatherAndOrganizeLocalStorageTokenData();

                $token_generated = JWT::encode($token_data, env('JWT_TOKEN_KEY'), 'HS256');

                return response(["userid"=>Auth::user()->id, "token" => $token_generated], 200);
            
            // User account is inactive
            }else if(!Auth::user()->status && empty(Auth::user()->dh_ultimo_acesso)){

                if($this->activateAccount()){

                    $token_data = $this->gatherAndOrganizeLocalStorageTokenData();

                    $token_generated = JWT::encode($token_data, env('JWT_TOKEN_KEY'), 'HS256');

                    return response(["userid"=>Auth::user()->id, "token" => $token_generated], 200);

                }else{

                    return response(["error" => "activation"], 500);

                }

             // User account is disabled
            }else if(!Auth::user()->status && !empty(Auth::user()->dh_ultimo_acesso)){

                return  response(["error" => "account_disabled"], 500);

            }

        }

        return response(["error" => "invalid_credentials"], 500);

    }

    private function gatherAndOrganizeLocalStorageTokenData() : array {

        if(Auth::user()->id_perfil === 1){

            $token_data = [
                "id" => Auth::user()->id, 
                "name"=> Auth::user()->nome,  
                "email"=> Auth::user()->email, 
                "profile_id" => Auth::user()->id_perfil,
                "profile" => Auth::user()->profile->nome,
                "complementary_data" => Auth::user()->id_dados_complementares,
                "last_access" => Auth::user()->dh_ultimo_acesso,
                "last_update" => Auth::user()->dh_atualizacao,
                "user_powers" => $this->modulesProfileRelationshipFormated()
            ];
        
        }else{

            $token_data = array(
                "id" => Auth::user()->id, 
                "name"=> Auth::user()->nome, 
                "email"=> Auth::user()->email, 
                "profile_id" => Auth::user()->id_perfil, 
                "profile" => Auth::user()->profile->nome,
                "user_complementary_data" => array(
                    "complementary_data_id" => Auth::user()->complementary_data->id,
                    "habANAC" => Auth::user()->complementary_data->habANAC,
                    "CPF" => Auth::user()->complementary_data->CPF,
                    "CNPJ" => Auth::user()->complementary_data->CNPJ,
                    "telephone" => Auth::user()->complementary_data->telefone,
                    "cellphone" => Auth::user()->complementary_data->celular,
                    "razaoSocial" => Auth::user()->complementary_data->razaoSocial,
                    "nomeFantasia" => Auth::user()->complementary_data->nomeFantasia
                ),
                "user_address_data" => array(
                    "user_address_id" => Auth::user()->address->id_endereco,
                    "logradouro" => Auth::user()->address->logradouro,
                    "numero" => Auth::user()->address->numero,
                    "cep" => Auth::user()->address->cep,
                    "cidade" => Auth::user()->address->cidade,
                    "estado" => Auth::user()->address->estado,
                    "complemento" => Auth::user()->address->complemento
                ),
                "last_access" => Auth::user()->dh_ultimo_acesso,
                "last_update" => Auth::user()->dh_atualizacao,
                "user_powers" => $this->modulesProfileRelationshipFormated()
            );

        }

        return $token_data;

    }

    /**
     * Organização dos dados referentes aos privilégios do perfil do usuário autenticado
     * 
     */
    private function modulesProfileRelationshipFormated() : array {

        $model = new ProfileHasModuleModel();
        $profile_data = $model->loadProfilesModulesRelationship(Auth::user()->id_perfil);

        $arrData = [];
        $row = 0;
        $current_record_data = array();

        foreach($profile_data["data"] as $row => $record){

            $module_name = $record->id_modulo === 1 ? 
            "Administração" 
            : ($record->id_modulo === 2 ? "Planos" : ($record->id_modulo === 3 ? "Ordens" : ($record->id_modulo === 4 ? "Relatórios" : "Incidentes")));

            $current_record_data[$record->id_modulo] = ["module" => $module_name, "profile_powers" => ["ler" => $record->ler, "escrever" => $record->escrever]];
       
            if($record->id_modulo === 5){

                $arrData = $current_record_data;

            }

        }

        // Add profile and modules relationship to the auth facade
        Auth::user()->modules_privileges = $arrData;

        return $arrData;

    }

    private function activateAccount(){

        try{

            UserModel::where("id", Auth::user()->id)->update("status", 1);

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

            DB::table("users")->where('id', Auth::user()->id)->update(["id_dados_complementares" => $new_comp_data_id]);

            return true;

        }catch(\Exception $e){

            return false;

        }

    }

    /*
    private function generateSession(array $token_data, array $profile_module_data) : void {

        Session::put("user_authenticated", true);
        Session::put("id", $token_data["id"]);
        Session::put("modules_access", $profile_module_data);

    }*/

}
