<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, $requiredAccess)
    {

        // O valor de acesso do usuário deve ser igual ou menor do que o necessário
        // Quanto menor o valor, maior o acesso
        if($request->session()->get("access") > $requiredAccess){
            return route("acessar");
        }

        // Continuar requisição
        return $next($request);
    }
}
