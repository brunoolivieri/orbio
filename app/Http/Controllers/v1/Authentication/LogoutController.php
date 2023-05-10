<?php

namespace App\Http\Controllers\v1\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    public function __invoke(Request $request)
    {
        try {

            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response(["message" => ""], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
