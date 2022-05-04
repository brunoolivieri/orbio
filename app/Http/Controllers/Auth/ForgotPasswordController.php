<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// Models
use App\Models\User\UserModel;
// Events
use App\Events\Auth\TokenForChangePasswordEvent;
use App\Events\User\UserPasswordChangedEvent;
// Email
use App\Mail\User\SendCodeToChangePassword;
use Illuminate\Support\Facades\Mail;
// Form Requests
use App\Http\Requests\Auth\ForgotPassword\SendTokenToEmailRequest;
use App\Http\Requests\Auth\ForgotPassword\UpdatePasswordRequest;
// Log
use Illuminate\Support\Facades\Log;

class ForgotPasswordController extends Controller
{
    
    /**
     * Método para processar o envio do código necessário para alteração da senha
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function generateAndSendPasswordChangeToken(SendTokenToEmailRequest $request) : \Illuminate\Http\Response {

        try{

            DB::transaction(function () use ($request) {

                $random_integer_token = random_int(1000, 9999);

                $user = UserModel::where("email", $request->email)->firstOrFail();

                $user->update(['token' => $random_integer_token]);

                UserModel::where('email', $request->email)->update(['token' => $random_integer_token]);

                // Send token event
                event(new TokenForChangePasswordEvent($user, $random_integer_token));

                Log::channel('mail')->info("[Email enviado com sucesso | Alteração da senha] - Destinatário: ".$request->email);

            });

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('mail')->error("[O envio do email falhou | Alteração da senha] - Destinatário: ".$request->email."| Erro:".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }

    }

    /**
     * Método para processar a alteração da senha 
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function passwordChangeProcessing(UpdatePasswordRequest $request) : \Illuminate\Http\Response {

        try{

            $user = UserModel::where('token', $request->token)->firstOrFail();

            $user->update(['senha' => password_hash($request->new_password, PASSWORD_DEFAULT)]);

            event(new UserPasswordChangedEvent($user));

            Log::channel('user')->info("[Senha alterada com sucesso | Recuperação da conta] - Token utilizado: ".$request->token);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('user')->info("[Erro na alteração da senha| Recuperação da conta] - Token utilizado: ".$request->token."| Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }   

    }


}
