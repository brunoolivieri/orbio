<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Model utilizado
use App\Models\Auth\RecoveryAccount;
use App\Models\User\UserModel;

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
    function index(Request $request) : \Illuminate\Http\Response {

        $model = new RecoveryAccount();

        if(UserModel::where('email', $request->email)->where('status', true)->exists()){

            $tokenGenerated = $model->generateTokenForChangePassword();

            $model_response = $model->insertTokenIntoUserRegistry($request->email, (int) $tokenGenerated);

            if($model_response["status"] && !$model_response["error"]){

                $model_response = $model->sendTokenToUserEmail($request->email, (int) $tokenGenerated);

                if($model_response["status"] && !$model_response["error"]){
    
                    return response("", 200);
    
                }else if(!$model_response["status"] && $model_response["error"]){
    
                    return response(["error" => $model_response["error"]], 500);
                }
                
            }else if(!$model_response["status"] && $model_response["error"]){
    
                return response(["error" => $model_response["error"]], 500);
    
            }

        }else{

            return response(["error" => "unregistered_email"], 500);

        }
        
    }

    /**
     * Método para processar a alteração da senha 
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function passwordChangeProcessing(Request $request) : \Illuminate\Http\Response {

        $model = new RecoveryAccount();

        $response = $model->passwordChangeFromTokenReceivedByEmail($request->new_password, $request->token);

        if($response["status"] && !$response["error"]){
            
            return response("", 200);

        }else if(!$response["status"] && $response["error"]){

            return response($response["error"], 500);

        }

    }


}
