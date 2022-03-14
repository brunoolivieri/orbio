<?php

namespace App\Http\Middleware\Custom\Modules;

use Closure;
use Illuminate\Http\Request;

class ReportsMiddleware
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
        if(request()->auth != "none" || $request->auth != "none"){

            // Se o método for "GET" OU "DELETE" o parâmetro "auth" é uma query string
            if($request->method() == "GET" || $request->method() == "DELETE"){

                $array_params = explode(".", request()->auth);
            
            // Se o método não for "GET" o parâmetro "auth" é incluso no corpo da requisição
            }else if($request->method() == "POST" || $request->method() == "PATCH"){

                $array_params = explode(".", $request->auth);

            }

            $user_id = $array_params[0];
            $module_id = $array_params[1];
            $module_action = $array_params[2];

            // Checar se o usuário que fez a requisição tem o mesmo ID do gravado na sessão
            $user_id_check = $user_id == $request->session()->get("id");

            // Checar se o usuário tem permissão para acessar a ação do módulo
            // Esse valor é salvo na sessão, e é recuperado dinâmicamente com as variáveis $module_id e $module_action
            $user_module_action_check = $request->session()->get("modules_access")[$module_id]["profile_powers"][$module_action] == 1 ? TRUE : FALSE;

            if(!$user_id_check || !$user_module_action_check){

                // O usuário é redirecionado para "/sistema" com uma resposta
                // Aparecerá o mesmo modal de erro de quando o Token JWT é inválido
                return redirect("/acessar");

            }

        }

        // Continuar requisição
        return $next($request);

    }
}
