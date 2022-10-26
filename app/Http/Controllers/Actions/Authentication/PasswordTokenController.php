<?php

namespace App\Http\Controllers\Actions\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
// Custom
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
        $user = $this->userModel->where("email", $request->email)->with("password_reset")->firstOrFail();

        if ($user->trashed()) {
            return response()->json([
                "message" => "Conta desabilitada.!"
            ], 500);
        }

        DB::transaction(function () use ($user) {

            if ($user->password_reset()->exists()) {
                $user->password_reset()->delete();
            }

            $token = Str::random(10);

            $this->passwordResetModel->insert(
                [
                    "user_id" => $user->id,
                    "token" => $token
                ]
            );

            $user->refresh();

            $user->notify(new SendTokenNotification($user));
        });

        return response()->json([
            "message" => "Sucesso! Confira o seu e-mail!"
        ], 200);
    }
}
