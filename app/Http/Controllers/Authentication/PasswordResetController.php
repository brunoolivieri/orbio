<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Hash;
// Custom
use App\Models\PasswordResets\PasswordReset;
use App\Notifications\Auth\ChangePasswordNotification;
use App\Http\Requests\Auth\ForgotPassword\UpdatePasswordRequest;

class PasswordResetController extends Controller
{

    function __construct(PasswordReset $passwordResetModel)
    {
        $this->model = $passwordResetModel;
    }

    public function __invoke(UpdatePasswordRequest $request)
    {
        try {
            $token = $this->model->where("token", $request->token)->first();

            if (!$token) {
                throw new Exception("Token inválido");
            }

            $token->user->update([
                "password" => Hash::make($request->password)
            ]);

            $token->delete();
            $token->user->notify(new ChangePasswordNotification($token->user));

            return response(["message" => "Senha alterada com sucesso!"], 200);
        } catch (Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }
}
