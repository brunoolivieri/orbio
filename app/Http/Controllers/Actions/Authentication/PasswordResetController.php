<?php

namespace App\Http\Controllers\Actions\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// Custom
use App\Models\Users\User;
use App\Models\PasswordResets\PasswordReset;
use App\Notifications\Auth\ChangePasswordNotification;
use App\Http\Requests\Auth\ForgotPassword\UpdatePasswordRequest;

class PasswordResetController extends Controller
{

    function __construct(PasswordReset $passwordResetModel)
    {
        $this->passwordResetModel = $passwordResetModel;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(UpdatePasswordRequest $request)
    {
        DB::transaction(function () use ($request) {

            $password_reset = $this->passwordResetModel->where("token", $request->token)->with("user")->firstOrFail();

            $password_reset->user->update([
                "password" => $request->new_password
            ]);

            $password_reset->delete();

            $password_reset->user->notify(new ChangePasswordNotification($password_reset->user));
        });

        return response(["message" => "Senha alterada com sucesso!"], 200);
    }
}
