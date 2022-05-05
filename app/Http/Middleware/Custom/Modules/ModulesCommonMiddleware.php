<?php

namespace App\Http\Middleware\Custom\Modules;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ModulesCommonMiddleware
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

        // As operações que não necessitam de autenticação enviam "auth" com valor "none"
        if(request()->auth != "none" && $request->auth != "none"){

            // Se o método for "GET" OU "DELETE" o parâmetro "auth" é uma query string
            if($request->method() == "GET" || $request->method() == "DELETE"){

                $request_params = explode(".", request()->auth);
            
            // Se o método não for "GET" o parâmetro "auth" é incluso no corpo da requisição
            }else if($request->method() == "POST" || $request->method() == "PATCH"){

                $request_params = explode(".", $request->auth);

            }

            // ID do usuário vindo do frontend
            $user_id = $request_params[0];
            // ID do módulo vindo do frontend - existem 5 tipos
            // É substraído 1 porque será utilizado como índice
            $module_index = $request_params[1] - 1;
            // Ação a ser executada no módulo
            $module_action = $request_params[2];

            // Checar se o usuário que fez a requisição tem o mesmo ID do gravado na sessão
            $user_id_check = $user_id == Auth::user()->id;

            // Checar se o usuário tem permissão para acessar a ação do módulo
            // Esse valor é salvo na sessão, e é recuperado dinâmicamente com as variáveis $module_id e $module_action
            $user_module_action_check = Auth::user()->profile->module_privileges[$module_index][$module_action];

            if(!$user_id_check || !$user_module_action_check){

                // O usuário é deslogado
                return redirect("/sistema/sair");

            }

        }
        
        // Continuar requisição
        return $next($request);
        
    }
}
