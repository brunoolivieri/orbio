<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Models
use App\Models\User\UserModel;

// Email
use App\Mail\UserChangePasswordEmail;
use Illuminate\Support\Facades\Mail;

// Form Requests
use App\Http\Requests\Auth\ForgotPassword\SendTokenToEmailRequest;
use App\Http\Requests\Auth\ForgotPassword\UpdatePasswordRequest;

class ForgotPasswordController extends Controller
{
    
    /**
     * Método para processar o envio do código necessário para alteração da senha
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function generateAndSendPasswordChangeToken(SendTokenToEmailRequest $request) : \Illuminate\Http\Response {

        $random_integer_token = random_int(1000, 9999);

        try{

            UserModel::where('email', $request->email)->update(['token' => $random_integer_token]);

            Mail::to($request->email)->send(new UserChangePasswordEmail($random_integer_token));

            return response("", 200);

        }catch(\Exception $e){

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

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);

        }   

    }


}
