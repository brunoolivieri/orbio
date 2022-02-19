<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*

- ARQUIVO DE ROTAS API - REQUISIÇÕES AJAX
- ESSE ARQUIVO RECEBE AS REQUISIÇÕES DAS OPERAÇÕES AJAX, COMO LOGIN, REGISTRO DE USUÁRIO, ETC

*/

Route::middleware('auth:api')->get('/user', function(Request $request){
    return $request->user();
});

