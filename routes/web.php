<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
// Controladores de autenticação
use App\Http\Controllers\Auth\LoginController; 
use App\Http\Controllers\Auth\RegistrationController; 
use App\Http\Controllers\Auth\ForgotPasswordController; 
// Controlador da entrada para o sistema interno
use App\Http\Controllers\Pages\CommonInternalController; 
// Controlador da seção interna "minha conta"
use App\Http\Controllers\Pages\AccountSectionController;
// Controladores dos módulos
use App\Http\Controllers\Modules\Administration\AdministrationModuleUserPanelController;
use App\Http\Controllers\Modules\Administration\AdministrationModuleProfilePanelController;
use App\Http\Controllers\Modules\Report\ReportModuleController;
use App\Http\Controllers\Modules\FlightPlan\FlightPlanModuleController;
use App\Http\Controllers\Modules\ServiceOrder\ServiceOrderModuleController;
use App\Http\Controllers\Modules\Incident\IncidentModuleController;
use App\Http\Controllers\Modules\Equipment\EquipmentModuleBatteryPanelController;
use App\Http\Controllers\Modules\Equipment\EquipmentModuleDronePanelController;
use App\Http\Controllers\Modules\Equipment\EquipmentModuleEquipmentPanelController;

// Views externas
Route::get('/', function(){ return redirect("/acessar"); }); 
Route::view('/acessar', "react_root"); 
Route::view('/recuperarsenha', "react_root"); 

// Rotas internas, do mapa e de logout 
Route::get('/sistema', [CommonInternalController::class, "index"])->middleware(["session.auth"]); 
Route::get('/sistema/{internalpage?}', [CommonInternalController::class, "refreshInternalSystem"])->where(["internalpage" => "^(?!sair|mapa).*$"]); 
Route::get('/sistema/sair', [CommonInternalController::class, "logout"]); 
Route::view('/sistema/mapa', "map")->middleware(["session.auth"]); 

// ===================================================================== ROTAS "/API/" ===================================================================== //

// Operações de autenticação básicas
Route::post('/api/acessar', [LoginController::class, "index"]); 
Route::post('/api/enviar-codigo', [ForgotPasswordController::class, "generateAndSendPasswordChangeToken"]); 
Route::post('/api/alterar-senha', [ForgotPasswordController::class, "passwordChangeProcessing"]); 
Route::post('/api/get-auth-data', [CommonInternalController::class, "getUserAuthenticatedData"])->middleware(["session.auth"]); 

// Operações da seção "minha conta"
Route::middleware(["session.auth"])->group(function(){
    Route::get('/api/user-account-data', [AccountSectionController::class, "loadUserAccountData"]);
    Route::patch('/api/update-basic-data/{id}', [AccountSectionController::class, "userBasicDataUpdate"]);
    Route::patch('/api/update-documents-data/{id}', [AccountSectionController::class, "userDocumentsUpdate"]);
    Route::patch('/api/update-address-data/{id}', [AccountSectionController::class, "userAddressUpdate"]);
    Route::post("/api/desactivate-account/{id}", [AccountSectionController::class, "userAccountDesactivation"]);
    Route::post("/api/update-password/{id}", [AccountSectionController::class, "userPasswordUpdate"]);
});

// Operações dos módulos
Route::middleware(["session.auth"])->group(function(){
    Route::resource("/api/admin-module-user", AdministrationModuleUserPanelController::class);
    Route::resource("/api/admin-module-profile", AdministrationModuleProfilePanelController::class);
    Route::resource("/api/reports-module", ReportModuleController::class);
    Route::resource("/api/plans-module", FlightPlanModuleController::class);
    Route::get("/api/plans-module-download/{filename}", [FlightPlanModuleController::class, "getFlightPlanFile"]);
    Route::resource("/api/orders-module", ServiceOrderModuleController::class);
    Route::resource("/api/incidents-module", IncidentModuleController::class);
    Route::resource("/api/equipments-module-drone", EquipmentModuleDronePanelController::class);
    Route::resource("/api/equipments-module-battery", EquipmentModuleBatteryPanelController::class);
    Route::resource("/api/equipments-module-equipment", EquipmentModuleEquipmentPanelController::class);
});



