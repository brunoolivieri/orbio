<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
// Custom
use App\Models\User\UserModel;
use App\Models\PasswordReset\PasswordResetModel;
use App\Events\Auth\TokenForChangePasswordEvent;
use App\Events\User\UserPasswordChangedEvent;
use App\Events\Auth\RequestedTokenEvent;
use App\Services\Auth\PasswordResetService;

class PasswordResetService{
    
    /**
     * Method for proccess token request. 
     * 
     * @param App\Http\Requests\Auth\ForgotPassword\PasswordResetTokenRequest $request
     * @return array
     */
    public function getToken($request) : array {

        try{

            DB::beginTransaction();

            $user = UserModel::where("email", $request->email)->firstOrFail();

            // If doesn't has soft deleted
            if(!$user->trashed()){

                $token = Str::random(10);

                PasswordResetModel::where("user_id", $user->id)->delete();
                PasswordResetModel::create(["user_id" => $user->id, "token" => $token]);

                $data_for_email = [
                    "token" => $token,
                    "name" => $user->name,
                    "email" => $user->email
                ];

                event(new RequestedTokenEvent($data_for_email));

                DB::Commit();

                return ["status" => true, "message" => "Sucesso! Confira o seu e-mail!"];

            }else{

                DB::rollBack();

                return ["status" => false, "error" => "Alteração da senha falhou!"];

            }

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => $e->getMessage()];

        }
        
    }

     /**
     * Method for proccess password reset.
     * 
     * @param App\Http\Requests\Auth\ForgotPassword\UpdatePasswordRequest $request
     * @return array
     */
    public function updatePassword($request) : array {

        try{

            $token = PasswordResetModel::where("token", $request->token)->firstOrFail();

            $token->user()->update(["password" => Hash::make($request->new_password)]);

            PasswordResetModel::where("user_id", $token->user_id)->delete();

            event(new UserPasswordChangedEvent($token->user->name, $token->user->email));

            return ["status" => true, "message" => "Senha alterada com sucesso!"];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        } 

    }
}