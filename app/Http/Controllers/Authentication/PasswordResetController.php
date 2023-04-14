<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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

            DB::transaction(function () use ($request) {

                $token = $this->model->where("token", $request->token)->first();

                if (!$token || $token->trashed()) {
                    throw new \Exception("Código inválido", 404);
                }

                $token->user->update([
                    "password" => Hash::make($request->password)
                ]);

                $token->delete();
                $token->user->notify(new ChangePasswordNotification($token->user));
            });

            return response(["message" => "Senha alterada com sucesso!"], 200);
            
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
