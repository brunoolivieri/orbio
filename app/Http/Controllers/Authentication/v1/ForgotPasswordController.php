<?php

namespace App\Http\Controllers\Authentication\v1;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Notifications\Auth\ChangePasswordNotification;
use App\Notifications\Auth\SendTokenNotification;
use App\Http\Requests\Auth\ForgotPassword\PasswordResetTokenRequest;
use App\Http\Requests\Auth\ForgotPassword\UpdatePasswordRequest;
use App\Models\Users\User;
use App\Models\PasswordResets\PasswordReset;

class ForgotPasswordController extends Controller
{
    function __construct(User $userModel, PasswordReset $passwordResetModel)
    {
        $this->userModel = $userModel;
        $this->passwordResetModel = $passwordResetModel;
    }

    function getToken(PasswordResetTokenRequest $request)
    {
        try {

            $user = $this->userModel->where("email", $request->email)->with("password_reset")->first();

            if (!$user) {
                throw new \Exception("Erro! O email não foi encontrado.", 404);
            }

            if ($user->trashed()) {
                throw new \Exception("Erro! A conta está inativa.", 409);
            }

            // Turn invalid all active tokens
            if ($user->password_reset->count() > 0) {
                $user->password_reset()->delete();
            }

            $token = $this->passwordResetModel->create([
                "user_id" => $user->id,
                "token" => Str::random(10)
            ]);

            $user->refresh();
            $user->notify(new SendTokenNotification($user, $token));

            return response(["message" => "Sucesso! Confira o seu e-mail!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    function changePassword(UpdatePasswordRequest $request)
    {
        try {

            DB::transaction(function () use ($request) {

                $code = $this->model->where("token", $request->code)->first();

                if (!$code || $code->trashed()) {
                    throw new \Exception("Código inválido", 404);
                }

                $code->user->update([
                    "password" => Hash::make($request->password)
                ]);

                $code->delete();
                $code->user->notify(new ChangePasswordNotification($code->user));
            });

            return response(["message" => "Senha alterada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
