<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    /**
     * Logout.
     * 
     * @param \Illuminate\Http\Request $request
     * @return Redirect
     */
    function index(Request $request) {

        Auth::logout();

        $request->session()->invalidate();
 
        $request->session()->regenerateToken();

        return redirect("/login");

    }
}
