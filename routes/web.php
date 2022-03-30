<?php

use Illuminate\Support\Facades\Route;

// CONTROLADORES DE AUTENTICAÇÃO
use App\Http\Controllers\Auth\LoginController; // Controlador do Login 
use App\Http\Controllers\Auth\RegistrationController; // Controlador do Registro
use App\Http\Controllers\Auth\ForgotPasswordController; // Controlador da recuperação da senha

// CONTROLADORES DAS PÁGINAS INTERNAS DO SISTEMA
use App\Http\Controllers\Pages\CommonInternalPagesController; // Controlador geral do sistema interno
use App\Http\Controllers\Pages\AdministrationPageController; // Controlador da página de administrador

// CONTROLADORES DAS FUNÇÕES DE USUÁRIO
use App\Http\Controllers\User\CommonUserController; // Controlador do usuário geral

// CONTROLADORES DAS FUNÇÕES DOS MÓDULOS DO SISTEMA
use App\Http\Controllers\Modules\AdministrationModuleController;
use App\Http\Controllers\Modules\ReportsModuleController;
use App\Http\Controllers\Modules\FlightPlansModuleController;
use App\Http\Controllers\Modules\ServiceOrdersModuleController;
use App\Http\Controllers\Modules\IncidentsModuleController;

/*

- ARQUIVO DE ROTAS WEB - PAGINAÇÃO E OUTROS
- TODAS AS ROTAS DIRECIONAM PARA UM ARQUIVO ROOT ONDE O CONTEÚDO REACT É RENDERIZADO 
- JÁ AS ROTAS DO REACT SERVEM PARA CARREGAR OS DIFERENTES COMPONENTES NA VIEW ROOT

*/

// ==== ROTAS QUE RETORNAM AS VIEWS EXTERNAS ==== //
Route::get('/', function(){ return redirect("/acessar"); }); // Redirecionar de "/" para "/acessar"
Route::view('/acessar', "react_main_root"); // Rota do login - retornar a view 
Route::view('/recuperarsenha', "react_main_root"); // Rota da recuperação da senha - retornar a view 

// ==== ROTAS INTERNAS, ROTA DO MAPA E ROTA DE SAÍDA DO SISTEMA ==== //
Route::get('/sistema', [CommonInternalPagesController::class, "index"])->middleware(["session.auth"]); // Realizar verificações e retornar a view na rota "/sistema"
Route::get('/sistema/{internalpage?}', function(){ return redirect("/sistema"); })->where(["internalpage" => "^((?!sair).)*$"]); // Qualquer requisição para uma subrota de "/sistema" redirecionar para "/sistema"
Route::get('/sistema/sair', [CommonInternalPagesController::class, "logout"]); // Rota acessada quando o usuário sai do sistema - sessão é terminada e o usuário é enviado para o login
//Route::view('/sistema/mapa', "map_root")->middleware(["session.auth"]); // Rota acessada quando o usuário pretende acessar o mapa

// ==== ROTA DO LINK ENVIADO POR EMAIL ==== //
Route::get('/registrar/ativar', [CommonUserController::class, "userAccountActivation"]); // Rota acessada pelo usuário via e-mail - sempre possui o query parameter do ID do usuário

// ==== ROTAS DE REQUISIÇÕES API - OPERAÇÕES DE AUTENTICAÇÃO BÁSICAS ==== //
Route::post('/api/acessar', [LoginController::class, "index"]); // Requisição de login/acesso
Route::post('/api/enviar-codigo', [ForgotPasswordController::class, "index"]); // Requisição de envio do código para alteração da senha do usuário
Route::post('/api/alterar-senha', [ForgotPasswordController::class, "passwordChangeProcessing"]); // Requisição de alteração da senha do usuário
Route::post('/api/get-token-data', [CommonInternalPagesController::class, "getDataFromTokenJwt"]); // Requisição para decodificação do token JWT

// ==== ROTAS DE API - OPERAÇÕES DO USUÁRIO LOGADO ==== //
Route::get('/api/user-account-data', [CommonUserController::class, "loadUserAccountData"])->middleware("session.auth"); // Requisição para recuperação dos dados do usuário (básicos e complementares)
Route::patch('/api/update-basic-data/{id}', [CommonUserController::class, "userBasicDataUpdate"])->middleware("session.auth"); 
Route::patch('/api/update-complementary-data/{id}', [CommonUserController::class, "userComplementaryDataUpdate"])->middleware("session.auth"); 
Route::post("/api/desactivate-account", [CommonUserController::class, "userAccountDesactivation"])->middleware("session.auth"); 

// ==== ROTAS DE REQUISIÇÕES API - MÓDULOS ==== //
Route::resource("/api/admin-module", AdministrationModuleController::class)->middleware(["session.auth", "modules.common.authorization"]);
Route::resource("/api/reports-module", ReportsModuleController::class)->middleware(["session.auth", "modules.common.authorization"]);
Route::resource("/api/plans-module", FlightPlansModuleController::class)->middleware(["session.auth", "modules.common.authorization"]);
Route::resource("/api/orders-module", ServiceOrdersModuleController::class)->middleware(["session.auth", "modules.common.authorization"]);
Route::resource("/api/incidents-module", IncidentsModuleController::class)->middleware(["session.auth", "modules.common.authorization"]);

