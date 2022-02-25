<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SessionAuthMiddleware
{
    /**
     * Resgata a requisição para a rota
     * Realiza a verificação da existência de uma sessão
     * Realiza a verificação da validade da sessão
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {

        if (!$request->session()->has("user_authenticated") || !$request->session()->get("user_authenticated")) {

            return redirect("/acessar");

        }

        // Continuar requisição
        return $next($request);
    }
}
