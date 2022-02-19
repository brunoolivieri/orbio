<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

// Model utilizado
use App\Models\User\UserAuthenticationOperationsModel;
use App\Models\ProfileAndModule\ProfileHasModuleModel;

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

        $model = new UserAuthenticationOperationsModel();

        $response = $model->userAuthentication($request);

        // Se o registro foi realizado com sucesso
        if($response["status"] && !$response["error"]){

            // $userData recebe o array dos dados do usuário logado
            $userData = $response["data"];

            // Geração da sessão
            $this->generateSession($userData);

            // Geração do Token JWT
            if($tokenGenerated = $this->generateTokenJWT($userData)){

                return response(["userid"=>$userData["id"], "token" => $tokenGenerated], 200);

            }else{

                return response(["error" => "token"], 500);

            }

        }else if(!$response["status"] && $response["error"]){

            return response(["error" => $response["error"]], 500);


        }

    }

    /**
     * Método para gerar a sessão após a autenticação bem sucedida
     * 
     * @param array $userData
     */
    private function generateSession(array $userData) : void {

        Session::put("user_authenticated", true);
        Session::put("id", $userData["id"]);
        Session::put("access", $userData["general_access"]);

    }

    /**
     * Método para gerar o conteúdo do Token JWT após a autenticação do usuário
     * 
     * @param array $userData
     * @return array
     */
    private function generateTokenJWT(array $userData) {

        $model = new ProfileHasModuleModel();

        $response = $model->loadProfileModuleRelationshipExact($userData["profile_id"], NULL);

        if($response["status"] && !$response["error"]){

            $dataFormated = $this->profileModuleFormatData($response["data"], $userData);

            $userData["user_powers"] = $dataFormated;

            $key = env('JWT_TOKEN_KEY');

            $jwt_token = JWT::encode($userData, $key, 'HS256');

            return $jwt_token;

        }else if(!$response["status"] && $response["error"]){

            return false;

        }

    }

    // Essa é a mesma função usada pra formatar os dados do painel de perfis
    // Ela diverge parcialmente da original porque é adaptada pra esse outro contexto
    // Nesse caso ela cria a estrutura com os dados sobre a relação do perfil do usuário logado com os módulos
    private function profileModuleFormatData(object $profileData, array $userData) : array {

        $arrData = [];

        $row = 0;
        $modulesCurrentProfile = array();

        do{
           
            $profile_name = $userData["profile"];

            $module_name = $profileData[$row]->id_modulo === 1 ? "Administração" : ($profileData[$row]->id_modulo === 2 ? "Planos" : ($profileData[$row]->id_modulo === 3 ? "Ordens" : "Relatorios"));
            $modulesCurrentProfile[$profileData[$row]->id_modulo] = ["module" => $module_name, "profile_powers" => ["ler" => $profileData[$row]->ler, "escrever" => $profileData[$row]->escrever]];
       
            if($profileData[$row]->id_modulo === 4){

                $arrData = $modulesCurrentProfile;

            }

            $row += 1;

        }while($row < count($profileData));

        return $arrData;

    }

}
