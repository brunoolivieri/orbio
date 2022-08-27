<?php

namespace App\Http\Controllers\Actions\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
// Custom
use App\Models\User\UserModel;
use App\Models\PasswordReset\PasswordResetModel;
use App\Notifications\Auth\SendTokenNotification;
use App\Notifications\Auth\ChangePasswordNotification;

class PasswordTokenController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $user = UserModel::where("email", $request->email)->firstOrFail();

        if ($user->trashed()) {
            return response(["message" => "A conta foi desabilitada!"], 500);
        }

        DB::transaction(function () use ($request, $user) {

            $token = Str::random(10);

            $user->password_resets()->delete();
            PasswordResetModel::insert(["user_id" => $user->id, "token" => $token]);

            $user->notify(new SendTokenNotification($user));
        });

        return response(["message" => "Sucesso! Confira o seu e-mail!"], 200);
    }
}
