<?php

namespace App\Http\Controllers\Actions\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
// Custom
use App\Models\PasswordResets\PasswordReset;
use App\Notifications\Auth\ChangePasswordNotification;
use App\Http\Requests\Auth\ForgotPassword\UpdatePasswordRequest;

class PasswordResetController extends Controller
{

    function __construct(PasswordReset $passwordResetModel)
    {
        $this->passwordResetModel = $passwordResetModel;
    }

    public function __invoke(UpdatePasswordRequest $request): \Illuminate\Http\Response
    {
        DB::transaction(function () use ($request) {

            $password_reset = $this->passwordResetModel->where("token", $request->token)->with("user")->firstOrFail();

            $password_reset->user->update([
                "password" => $request->new_password
            ]);

            $password_reset->delete();

            $password_reset->user->notify(new ChangePasswordNotification($password_reset->user));
        });

        return response()->json([
            "message" => "Senha alterada com sucesso!"
        ], 200);
    }
}
