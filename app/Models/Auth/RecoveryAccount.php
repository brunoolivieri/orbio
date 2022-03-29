<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserChangePasswordEmail;

// Model utilizado para os procedimentos
use App\Models\User\UserModel;

class RecoveryAccount extends Model
{
    use HasFactory;

    function generateTokenForChangePassword(){

        return random_int(1000, 9999);

    }

    /**
     * Método para inserir o token no registro do usuário
     * 
     * @param object $request
     * @return \Illuminate\Http\Response
     */
    function insertTokenIntoUserRegistry(string $user_email, int $token) : array {

        try{

            UserModel::where('email', $user_email)->update(['token' => $token]);

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    function sendTokenToUserEmail(string $user_email, int $token) : bool {

        try{

            // Construção e envio do email do código para alteração da senha
            Mail::to($user_email)->send(new UserChangePasswordEmail($token));

            return true;

        }catch(\Exception $e){

            return false;

        }

    }

    /**
     * Método para processar a alteração da senha
     * 
     * @param object $request
     * @return \Illuminate\Http\Response
     */
    function passwordChangeFromTokenReceivedByEmail($new_password, $token) : array {

        try{

            if(UserModel::where('token', $token)->exists()){

                $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);

                UserModel::where('token', $token)->update(['senha' => $new_password_hash]);

                return ["status" => true, "error" => false];

            }else{

                return ["status" => false, "error" => "code"];

            }

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
