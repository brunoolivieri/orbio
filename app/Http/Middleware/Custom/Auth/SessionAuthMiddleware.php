<?php

namespace App\Http\Middleware\Custom\Auth;

use Closure;
use Illuminate\Http\Request;

class SessionAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {

        if (!$request->session()->has("user_authenticated") || !$request->session()->get("user_authenticated")) {

            // Interromper requisição e redirecionar para o login
            return redirect("/acessar");

        }

        // Continuar requisição
        return $next($request);

    }
}
