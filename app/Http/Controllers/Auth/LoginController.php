<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

// Models utilizados
use App\Models\Auth\AuthenticationModel;
use App\Models\ProfileAndModule\ProfileHasModuleModel;

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
    function index(LoginRequest $request) : \Illuminate\Http\Response {

        $model = new AuthenticationModel();

        $response_from_authentication = $model->userAuthentication($request);

        // Se o registro foi realizado com sucesso
        if($response_from_authentication["status"] && !$response_from_authentication["error"]){

            if($completed_token = $this->supplementTokenData($response_from_authentication["token_data"])){

                return response(["userid"=>$response_from_authentication["token_data"]["id"], "token" => $completed_token], 200);

            }else{

                return response(["error" => "token supplementation failed"], 500);

            }

        }else if(!$response_from_authentication["status"] && $response_from_authentication["error"]){

            return response(["error" => $response_from_authentication["error"]], 500);

        }

    }

    /**
     * Método para inicialização da geração da sessão e do token JWT
     * A sessão é criada apenas, não precisa ser retornada
     * O token JWT precisa ser retornado para o frontend, e por isso é retornado
     * 
     * @param array $userData
     * @return JWT 
     */
    private function supplementTokenData(array $token_data) {

        $model = new ProfileHasModuleModel();

        $response = $model->loadProfilesModulesRelationship($token_data["profile_id"]);

        if($response["status"] && !$response["error"]){

            // Recebimento dos dados perfil-módulo re-organizados em um array
            $profile_module_data = $this->profileModuleFormatData($response["data"], $token_data);

            // Inserção dos novos dados no token
            $full_jwt_token = $this->generateTokenJWT($token_data, $profile_module_data);

            $this->generateSession($token_data, $profile_module_data);

            return $full_jwt_token;

        }else if(!$response["status"] && $response["error"]){

            return false;

        }

    }

    /**
     * Método para gerar a sessão após a autenticação bem sucedida
     * 
     * @param array $token_data
     */
    private function generateSession(array $token_data, array $profile_module_data) : void {

        Session::put("user_authenticated", true);
        Session::put("id", $token_data["id"]);
        Session::put("modules_access", $profile_module_data);

    }

    /**
     * Método para gerar o conteúdo do Token JWT após a autenticação do usuário
     * 
     * @param array $token_data
     * @return array
     */
    private function generateTokenJWT(array $token_data, array $profile_module_data) : string {

        $token_data["user_powers"] = $profile_module_data;

        $token_generated = JWT::encode($token_data, env('JWT_TOKEN_KEY'), 'HS256');  

        return $token_generated;

    }

    /**
     * Método para para alocar os dados em uma estrutura de dados planejada
     * Possui a mesma lógica do método usado para formatar os dados do painel de perfis
     * Ela diverge parcialmente da original porque é adaptada para esse outro contexto
     * Nesse caso ela cria a estrutura com os dados sobre a relação especifica do perfil do usuário logado com os módulos 
     * 
     * @param array $profileData
     * @param array $userData
     */
    private function profileModuleFormatData(object $profileData, array $userData) : array {

        $arrData = [];

        $row = 0;
        $modulesCurrentProfile = array();

        do{
           
            $profile_name = $userData["profile"];

            $module_name = $profileData[$row]->id_modulo === 1 ? "Administração" : ($profileData[$row]->id_modulo === 2 ? "Planos" : ($profileData[$row]->id_modulo === 3 ? "Ordens" : ($profileData[$row]->id_modulo === 4 ? "Relatórios" : "Incidentes")));
            $modulesCurrentProfile[$profileData[$row]->id_modulo] = ["module" => $module_name, "profile_powers" => ["ler" => $profileData[$row]->ler, "escrever" => $profileData[$row]->escrever]];
       
            if($profileData[$row]->id_modulo === 5){

                $arrData = $modulesCurrentProfile;

            }

            $row += 1;

        }while($row < count($profileData));

        return $arrData;

    }

}
