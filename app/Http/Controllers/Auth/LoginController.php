<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
// Custom
use App\Models\User\UserModel;
use App\Http\Requests\Auth\Login\LoginRequest;
use App\Events\Auth\UserLoggedInEvent;
use App\Jobs\SendEmailJob;

class LoginController extends Controller
{

    private UserModel $user_model;

    /**
     * Dependency injection.
     * 
     * @param App\Models\User\UserModel $user
     */
    public function __construct(UserModel $user){
        $this->user_model = $user;
    }
    
    /**
     * Method for login processing
     * Exists 3 cases for valid credentials: user active, user inactive or user disabled.
     * 
     * @param Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    function index(LoginRequest $request) :  \Illuminate\Http\Response {

        // Password is converted to "senha" - this is defined in the model "UserModel"
        if($user = Auth::attempt(['email' => $request->email, 'password' => $request->password])){

            // Case 1: User account is active
            if(Auth::user()->status && !empty(Auth::user()->dh_ultimo_acesso)){

                $data_for_email = [
                    "id" => Auth::user()->id, 
                    "name" => Auth::user()->nome, 
                    "email" => Auth::user()->email, 
                    "profile" => Auth::user()->profile->nome
                ];

                SendEmailJob::dispatch("App\Events\Auth\UserLoggedInEvent", $data_for_email);

                Log::channel('login_action')->info("[Acesso realizado] - ID do usuário: ".Auth::user()->id." | Email:".Auth::user()->email);

                return response(["message" => "Acesso autorizado!"], 200);
            
            // Case 2: User account is inactive
            }else if(!Auth::user()->status && empty(Auth::user()->dh_ultimo_acesso)){

                if($this->activateAccountBeforeLogin()){

                    $data_for_email = [
                        "id" => Auth::user()->id, 
                        "name" => Auth::user()->nome, 
                        "email" => Auth::user()->email, 
                        "profile" => Auth::user()->profile->nome
                    ];
    
                    SendEmailJob::dispatch("App\Events\Auth\UserLoggedInEvent", $data_for_email);

                    Log::channel('login_action')->info("[Acesso realizado | Conta ativada] - ID do usuário: ".Auth::user()->id." | Email:".Auth::user()->email);

                    return response(["message" => "Acesso autorizado!"], 200);

                }else{

                    return response(["error" => "activation"], 500);

                }

            // Case 3: User account is disabled or deleted
            }else if((!Auth::user()->status && !empty(Auth::user()->dh_ultimo_acesso) || (!empty(Auth::user()->deleted_at)))){

                Log::channel('login_error')->error("[Acesso negado] - ID do usuário: ".Auth::user()->id." | Email:".Auth::user()->email."| Erro: Conta desabilitada ou removida do sistema.");

                return  response(["error" => "account_disabled"], 500);

            }

        }

        Log::channel('login_error')->error("[Acesso negado] - Email informado: ".$request->email." | Erro: Credenciais incorretas");

        return response(["error" => "invalid_credentials"], 500);

    }

    /**
     * Method for activate user account
     * 
     * @return bool
     */
    private function activateAccountBeforeLogin() : bool {

        $response = $this->user_model->accountActivation();

        if($response["status"] && !$response["error"]){

            return $response["status"];

        }else if(!$response["status"] && $response["error"]){

            Log::channel('login_error')->error("[Acesso negado | Ativação da conta falhou] - ID do usuário: ".Auth::user()->id." | Email:".Auth::user()->email."| Erro: ".$response["error"]);

            return $response["status"];

        }

    }

}
