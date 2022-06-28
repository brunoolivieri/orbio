<?php

use Illuminate\Support\Facades\Route;
// \Auth Controllers
use App\Http\Controllers\Auth\LoginController; 
use App\Http\Controllers\Auth\PasswordResetTokenController; 
use App\Http\Controllers\Auth\PasswordResetController; 
use App\Http\Controllers\Auth\LogoutController;
// \Internal Controller
use App\Http\Controllers\Internal\MainInternalController; 
use App\Http\Controllers\Internal\MyAccountController; 
use App\Http\Controllers\Internal\SupportController; 
// \Modules
use App\Http\Controllers\Modules\Administration\AdministrationModuleUserPanelController;
use App\Http\Controllers\Modules\Administration\AdministrationModuleProfilePanelController;
use App\Http\Controllers\Modules\Report\ReportModuleController;
use App\Http\Controllers\Modules\FlightPlan\FlightPlanModuleController;
use App\Http\Controllers\Modules\ServiceOrder\ServiceOrderModuleController;
use App\Http\Controllers\Modules\Incident\IncidentModuleController;
use App\Http\Controllers\Modules\Equipment\EquipmentModuleBatteryPanelController;
use App\Http\Controllers\Modules\Equipment\EquipmentModuleDronePanelController;
use App\Http\Controllers\Modules\Equipment\EquipmentModuleEquipmentPanelController;
// \Actions
use App\Http\Controllers\Actions\LoadFlightPlansController;
use App\Http\Controllers\Actions\LoadIncidentsController;
use App\Http\Controllers\Actions\LoadProfilesController;
use App\Http\Controllers\Actions\LoadReportsController;
use App\Http\Controllers\Actions\LoadUsersController;

// External Views
Route::get('/', function(){ return redirect("/login"); }); 
Route::view('/login', "react_root"); 
Route::view('/forgot-password', "react_root"); 

// Auth operations
Route::post('/api/auth/login', [LoginController::class, "index"]); 
Route::post('/api/auth/password-token', [PasswordResetTokenController::class, "index"]); 
Route::post('/api/auth/change-password', [PasswordResetController::class, "index"]); 

Route::middleware(["session.auth"])->group(function(){
    // Internal simple operations
    Route::get('/internal', [MainInternalController::class, "index"]); 
    Route::get('/internal/{internalpage?}', [MainInternalController::class, "refreshInternalSystem"])->where(["internalpage" => "^(?!auth|map).*$"]); 
    Route::get('/api/auth/logout', [LogoutController::class, "logout"]); 
    Route::view('/internal/map', "map"); 
    Route::post('/api/get-auth-data', [MainInternalController::class, "getUserAuthenticatedData"]); 
    // Internal "MyAccount" operations
    Route::get('/api/user-account-data', [MyAccountController::class, "loadAccountData"]);
    Route::patch('/api/update-basic-data/{id}', [MyAccountController::class, "basicDataUpdate"]);
    Route::patch('/api/update-documents-data/{id}', [MyAccountController::class, "documentsUpdate"]);
    Route::patch('/api/update-address-data/{id}', [MyAccountController::class, "addressUpdate"]);
    Route::post("/api/desactivate-account/{id}", [MyAccountController::class, "accountDesactivation"]);
    Route::post("/api/update-password/{id}", [MyAccountController::class, "passwordUpdate"]);
    // Internal Modules operations
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



