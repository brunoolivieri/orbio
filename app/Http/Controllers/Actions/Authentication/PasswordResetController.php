<?php

namespace App\Http\Controllers\Actions\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// Custom
use App\Models\PasswordReset\PasswordResetModel;
use App\Notifications\Auth\ChangePasswordNotification;

class PasswordResetController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        DB::transaction(function () use ($request) {

            $token = PasswordResetModel::where("token", $request->token)->firstOrFail();

            $token->user()->update(["password" => $request->new_password]);

            PasswordResetModel::where("user_id", $token->user_id)->delete();

            $token->user->notify(new ChangePasswordNotification($token->user));
        });

        return response(["message" => "Senha alterada com sucesso!"], 200);
    }
}
