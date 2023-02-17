<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Exception;
// Custom
use App\Models\Users\User;
use App\Http\Requests\Auth\Login\LoginRequest;
use App\Events\Auth\FirstSuccessfulLoginEvent;
use App\Events\Auth\LoginSuccessfulEvent;

class LoginController extends Controller
{

    public function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    public function __invoke(LoginRequest $request)
    {
        try {

            if (Auth::attempt(["email" => $request->email, "password" => $request->password, "deleted_at" => null])) {

                $user = $this->userModel->find(Auth::user()->id);

                if (!$user) {
                    throw new Exception("Credencias inválidas");
                }

                $request->session()->regenerate();

                // If is the first login
                if (!$user->status && is_null($user->last_access)) {
                    FirstSuccessfulLoginEvent::dispatch($user);
                }

                LoginSuccessfulEvent::dispatch($user);

                return response()->json([
                    "message" => "Acesso autorizado!"
                ], 200);
            } else {
                throw new Exception("Credencias inválidas");
            }
        } catch (\Exception $e) {
            if ($e->getMessage() === "Credencias inválidas") {
                return response()->json([
                    "message" => $e->getMessage()
                ], 404);
            } else {
                return response()->json([
                    "message" => $e->getMessage()
                ], 500);
            }
        }
    }
}
