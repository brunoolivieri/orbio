<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Model da tabela de usuário
use App\Models\User\UserModel;

// Classes da lib JWT
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class CommonInternalPagesController extends Controller
{
    
    /**
     * Método para retornar o layout blade
     * 
     * @return view
     */
    function index() {

        return view("react_main_root");

    }

    /**
     * Método para decodificar o token JWT e recuperar seus dados
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function getDataFromTokenJwt(Request $request) : \Illuminate\Http\Response {

        $key = env('JWT_TOKEN_KEY');

        // Decodifica o Token // Argumentos: Token, Key, e o algoritmo criptográfico
        $decoded = JWT::decode(json_decode($request->token), new Key($key, 'HS256'));

        if($decoded != NULL){

            $decoded_array = (array) $decoded;

            return response(["tokenData" => $decoded_array], 200);

        }else{

            return response(["error" => true], 500);

        }

    }

    /**
     * Método para deslogar do sistema
     * 
     * @return Redirect
     */
    function logout() {

        // Sessão do usuário é apagada
        Session::forget(["user_authenticated", "access"]);
        Session::flush();

        // Redirecionamento para a página de login
        return redirect("/acessar");

    }
    
}
