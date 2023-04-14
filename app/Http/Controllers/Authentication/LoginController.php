<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Users\User;
use App\Http\Requests\Auth\Login\LoginRequest;
use App\Events\Auth\FirstSuccessfulLoginEvent;
use App\Events\Auth\LoginSuccessfulEvent;

class LoginController extends Controller
{

    public function __construct(User $userModel)
    {
        $this->model = $userModel;
    }

    public function __invoke(LoginRequest $request)
    {
        try {

            if (Auth::attempt(["email" => $request->email, "password" => $request->password, "deleted_at" => null])) {

                $user = $this->model->find(Auth::user()->id);

                if (!$user) {
                    throw new \Exception("Usuário não encontrado", 404);
                }

                $request->session()->regenerate();

                if (!$user->status && is_null($user->last_access)) {
                    FirstSuccessfulLoginEvent::dispatch($user);
                }

                LoginSuccessfulEvent::dispatch($user);

                return response()->json([
                    "message" => "Acesso autorizado!"
                ], 200);
            } else {
                throw new \Exception("Credencias inválidas", 401);
            }
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
