<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserAccessMiddleware
{
    /**
     * Resgata a requisição para a rota
     * Realiza a verificação dos poderes de acesso do usuário
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {

        $array_params = explode("/", request()->auth);

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

        }else{

            // Continuar requisição
            return $next($request);

        }         
    }
}
