<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
// Custom
use App\Models\User\UserModel;
use App\Models\PasswordReset\PasswordResetModel;
use App\Services\Auth\PasswordResetService;
use App\Notifications\Auth\SendTokenNotification;
use App\Notifications\Auth\ChangePasswordNotification;

class PasswordResetService{
    
    /**
     * Method for proccess token request. 
     * 
     * @param Illuminate\Http\Request $request
     * @return array
     */
    public function getToken($request) {

        $user = UserModel::where("email", $request->email)->firstOrFail();

        if($user->trashed()){
            return response(["message" => "A conta foi desabilitada!"], 500);
        }

        DB::transaction(function () use ($request, $user) {
            
            $token = Str::random(10);

            $user->password_resets()->delete();
            PasswordResetModel::insert(["user_id" => $user->id, "token" => $token]);

            $data_for_email = [
                "token" => $token,
                "name" => $user->name,
                "email" => $user->email
            ];

            $user->notify(new SendTokenNotification($user));

        });

        return response(["message" => "Sucesso! Confira o seu e-mail!"], 200);
        
    }

     /**
     * Method for proccess password reset.
     * 
     * @param Illuminate\Http\Request $request
     * @return array
     */
    public function updatePassword($request) {

        DB::transaction(function () use ($request) {
            
            $token = PasswordResetModel::where("token", $request->token)->firstOrFail();

            $token->user()->update(["password" => Hash::make($request->new_password)]);

            PasswordResetModel::where("user_id", $token->user_id)->delete();

            $token->user->notify(new ChangePasswordNotification($token->user));

        });

        return response(["message" => "Senha alterada com sucesso!"], 200);

    }
}