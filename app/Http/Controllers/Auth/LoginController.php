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

// ==== Token JWT ==== https://github.com/firebase/php-jwt ==== https://www.youtube.com/watch?v=B-7e-ZpIWAs ==== //
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class LoginController extends Controller
{
    
    /**
     * Método para processar o login
     * Se for a primeira vez que é realizado, a conta também é ativada no processo
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function index(Request $request) : \Illuminate\Http\Response {

        $model = new AuthenticationModel();

        $response = $model->userAuthentication($request);

        // Se o registro foi realizado com sucesso
        if($response["status"] && !$response["error"]){

            // $userData recebe o array dos dados do usuário logado
            $userData = $response["data"];

            if($token_jwt = $this->generateTokenAndSession($userData)){

                return response(["userid"=>$userData["id"], "token" => $token_jwt], 200);

            }else{

                return response(["error" => "token"], 500);

            }

        }else if(!$response["status"] && $response["error"]){

            return response(["error" => $response["error"]], 500);

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
    private function generateTokenAndSession(array $user_data) {

        $model = new ProfileHasModuleModel();

        $response = $model->loadRecordThatMatchesExactlyTheParameters($user_data["profile_id"], NULL);

        if($response["status"] && !$response["error"]){

            // Recebimento dos dados perfil-módulo re-organizados em um array
            $profile_module_data = $this->profileModuleFormatData($response["data"], $user_data);

            // Geração da sessão
            $this->generateSession($user_data, $profile_module_data);

            // Geração e retorno do token JWT
            $token_jwt = $this->generateTokenJWT($user_data, $profile_module_data);

            return $token_jwt;

        }else if(!$response["status"] && $response["error"]){

            return false;

        }

    }

    /**
     * Método para gerar a sessão após a autenticação bem sucedida
     * 
     * @param array $user_data
     */
    private function generateSession(array $user_data, array $profile_module_data) : void {

        Session::put("user_authenticated", true);
        Session::put("id", $user_data["id"]);
        Session::put("modules_access", $profile_module_data);

    }

    /**
     * Método para gerar o conteúdo do Token JWT após a autenticação do usuário
     * 
     * @param array $userData
     * @return array
     */
    private function generateTokenJWT(array $user_data, array $profile_module_data) : string {

        $user_data["user_powers"] = $profile_module_data;

        $key = env('JWT_TOKEN_KEY');

        // Retorno do token gerado
        $token_generated = JWT::encode($user_data, $key, 'HS256');  

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
