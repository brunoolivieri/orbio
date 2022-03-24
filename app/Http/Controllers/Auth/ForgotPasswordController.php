<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Model utilizado
use App\Models\Auth\AuthenticationModel;

// Envio de email
use Illuminate\Support\Facades\Mail;

// Classe de Email
use App\Mail\UserChangePasswordEmail;

class ForgotPasswordController extends Controller
{
    
    /**
     * Método para processar o envio do código necessário para alteração da senha
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function index(Request $request) : array {

        $model = new AuthenticationModel();

        $response = $model->userSendCodeForChangePassword($request);

        if($response->status() === 200){

            // Construção e envio do email do código para alteração da senha
            Mail::to($request->email)->send(new UserChangePasswordEmail($response->content()));
            
            return array("status" => true);

        }else{

            return array("status" => false, "error" => $response->content());

        }

    }

    /**
     * Método para processar a alteração da senha 
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function changePassword(Request $request) : array {

        $model = new AuthenticationModel();

        $response = $model->userChangePassword($request);

        if($response->status() === 200){
            
            return array("status" => true);

        }else{

            return array("status" => false, "error" => $response->content());

        }

    }


}
