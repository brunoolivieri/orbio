<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Models\Users\User;
use App\Models\PasswordResets\PasswordReset;
use App\Notifications\Auth\SendTokenNotification;
use App\Http\Requests\Auth\ForgotPassword\PasswordResetTokenRequest;

class PasswordTokenController extends Controller
{

    function __construct(User $userModel, PasswordReset $passwordResetModel)
    {
        $this->userModel = $userModel;
        $this->passwordResetModel = $passwordResetModel;
    }

    public function __invoke(PasswordResetTokenRequest $request)
    {
        try {

            $user = $this->userModel->where("email", $request->email)->with("password_reset")->first();

            if (!$user) {
                throw new Exception("Erro! O email não foi encontrado.");
            }

            if ($user->trashed()) {
                throw new Exception("Erro! A conta está inativa.");
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
        } catch (Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }
}
