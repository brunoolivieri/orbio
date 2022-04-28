<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// Models
use App\Models\User\UserModel;
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

                $user = UserModel::where("email", $request->email)->first();

                $user->update(['token' => $random_integer_token]);

                UserModel::where('email', $request->email)->update(['token' => $random_integer_token]);

                $complete_name = explode(" ", $user->nome);
                $first_name = $complete_name[0];

                Mail::to($request->email)->send(new SendCodeToChangePassword(
                    [
                        "name" =>  $first_name,
                        "email" =>  $user->email,
                        "code" => $random_integer_token
                    ]
                ));

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

            UserModel::where('token', $token)->update(['senha' => password_hash($request->new_password, PASSWORD_DEFAULT)]);

            Log::channel('user')->info("[Senha alterada com sucesso | Recuperação da conta] - Token utilizado: ".$token);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('user')->info("[Erro na alteração da senha| Recuperação da conta] - Token utilizado: ".$token."| Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }   

    }


}
