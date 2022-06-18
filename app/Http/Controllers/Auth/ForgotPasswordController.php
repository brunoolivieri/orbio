<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
// Custom
use App\Models\User\UserModel;
use App\Models\PasswordReset\PasswordResetModel;
use App\Events\Auth\TokenForChangePasswordEvent;
use App\Events\User\UserPasswordChangedEvent;
use App\Mail\User\SendCodeToChangePassword;
use App\Http\Requests\Auth\ForgotPassword\SendTokenToEmailRequest;
use App\Http\Requests\Auth\ForgotPassword\UpdatePasswordRequest;
use App\Jobs\SendEmailJob;

class ForgotPasswordController extends Controller
{
    
    /**
     * Método para processar o envio do código necessário para alteração da senha
     * 
     * @param App\Http\Requests\Auth\ForgotPassword\SendTokenToEmailRequest $request
     * @return \Illuminate\Http\Response
     */
    function generateAndSendPasswordChangeToken(SendTokenToEmailRequest $request) : \Illuminate\Http\Response {

        try{

            DB::beginTransaction();

            $random_integer_token = random_int(1000, 9999);

            $user = UserModel::where("email", $request->email)->firstOrFail();

            // If doesn't has soft deleted
            if(!$user->trashed()){

                PasswordResetModel::where("user_id", $user->id)->delete();
                PasswordResetModel::create(["user_id" => $user->id, "token" => $random_integer_token]);

                $data_for_email = [
                    "token" => $random_integer_token,
                    "name" => $user->name,
                    "email" => $user->email
                ];

                SendEmailJob::dispatch("App\Events\Auth\TokenForChangePasswordEvent", $data_for_email);

                Log::channel('mail')->info("[Email enviado com sucesso | Alteração da senha] - Destinatário: ".$request->email);

                DB::Commit();

                return response("", 200);

            }else{

                DB::rollBack();

                return response("", 500);

            }

        }catch(\Exception $e){

            DB::rollBack();

            Log::channel('mail')->error("[O envio do email falhou | Alteração da senha] - Destinatário: ".$request->email."| Erro:".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }

    }

    /**
     * Método para processar a alteração da senha 
     * 
     * @param App\Http\Requests\Auth\ForgotPassword\UpdatePasswordRequest $request
     * @return \Illuminate\Http\Response
     */
    function passwordChangeProcessing(UpdatePasswordRequest $request) : \Illuminate\Http\Response {

        try{

            $token = PasswordResetModel::where("token", $request->token)->firstOrFail();

            $token->user()->update(["password" => Hash::make($request->new_password)]);

            PasswordResetModel::where("user_id", $token->user_id)->delete();

            event(new UserPasswordChangedEvent($token->user->name, $token->user->email));

            Log::channel('user')->info("[Senha alterada com sucesso | Recuperação da conta] - Token utilizado: ".$request->token);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('user')->info("[Erro na alteração da senha| Recuperação da conta] - Token utilizado: ".$request->token."| Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }   

    }


}
