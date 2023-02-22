<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class LogoutController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            
            Auth::logout();

            $request->session()->invalidate();

            $request->session()->regenerateToken();

            return response()->json([
                "message" => ""
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => $e->getMessage()
            ], 500);
        }
    }
}
