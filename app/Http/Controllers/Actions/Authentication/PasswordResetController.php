<?php

namespace App\Http\Controllers\Actions\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// Custom
use App\Models\User\UserModel;
use App\Models\PasswordReset\PasswordResetModel;
use App\Notifications\Auth\ChangePasswordNotification;
use App\Http\Requests\Auth\ForgotPassword\UpdatePasswordRequest;

class PasswordResetController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(UpdatePasswordRequest $request)
    {
        DB::transaction(function () use ($request) {

            $token = PasswordResetModel::where("token", $request->token)->firstOrFail();

            $user = UserModel::findOrFail($token->user_id);

            $user->password = $request->new_password;
            $user->save();

            $user->password_resets()->delete();

            $token->user->notify(new ChangePasswordNotification($token->user));
        });

        return response(["message" => "Senha alterada com sucesso!"], 200);
    }
}
