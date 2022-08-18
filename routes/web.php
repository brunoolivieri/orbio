<?php

use Illuminate\Support\Facades\Route;
// Auth Controllers
use App\Http\Controllers\Auth\{
    LoginController,
    PasswordResetTokenController,
    PasswordResetController,
    LogoutController
}; 
// Internal Controller 
use App\Http\Controllers\Internal\{
    DashboardController,
    MyAccountController,
    SupportController
}; 
// Modules
use App\Http\Controllers\Modules\Administration\{
    AdministrationModuleUsersController,
    AdministrationModuleProfilesController
};
use App\Http\Controllers\Modules\Report\ReportModuleController;
use App\Http\Controllers\Modules\FlightPlan\FlightPlanModuleController;
use App\Http\Controllers\Modules\ServiceOrder\ServiceOrderModuleController;
use App\Http\Controllers\Modules\Incident\IncidentModuleController;
use App\Http\Controllers\Modules\Equipment\{
    EquipmentModuleBatteryPanelController,
    EquipmentModuleDronePanelController,
    EquipmentModuleEquipmentPanelController
};
// Actions
use App\Http\Controllers\Actions\{
    LoadAuthData,
    LoadFlightPlansController,
    LoadIncidentsController,
    LoadProfilesController,
    LoadReportsController,
    LoadUsersController
};

// External Views
Route::get('/', function() { 
    return redirect("/login"); 
}); 
Route::view('/login', "react_root"); 
Route::view('/forgot-password', "react_root"); 

// External operations
Route::post('/api/auth/login', [LoginController::class, "index"]); 
Route::post('/api/auth/password-token', [PasswordResetTokenController::class, "index"]); 
Route::post('/api/auth/change-password', [PasswordResetController::class, "index"]); 

Route::middleware(["session.auth"])->group(function(){
    // Internal simple operations
    Route::view('/internal', "react_root"); 
    Route::get('/internal/{internalpage?}', function(){
        return redirect("/internal");
    })->where(["internalpage" => "^(?!auth|map).*$"]); 
    Route::get('/api/auth/logout', [LogoutController::class, "index"]); 
    Route::view('/internal/map', "map"); 
    // Internal Dashboard 
    Route::get('/api/load-dashboard-metrics', DashboardController::class);
    // Internal "MyAccount" operations
    Route::get('/api/load-basic-account-data', [MyAccountController::class, "loadBasicData"]);
    Route::get('/api/load-complementary-account-data', [MyAccountController::class, "loadComplementaryData"]);
    Route::get('/api/load-sessions-data', [MyAccountController::class, "loadActiveSessions"]);
    Route::patch('/api/update-basic-data', [MyAccountController::class, "basicDataUpdate"]);
    Route::patch('/api/update-documents-data', [MyAccountController::class, "documentsUpdate"]);
    Route::patch('/api/update-address-data', [MyAccountController::class, "addressUpdate"]);
    Route::post("/api/desactivate-account/{id}", [MyAccountController::class, "accountDesactivation"]);
    Route::post("/api/update-password", [MyAccountController::class, "passwordUpdate"]);
    // Internal Modules operations
    Route::ApiResource("/api/admin-module-user", AdministrationModuleUsersController::class);
    Route::ApiResource("/api/admin-module-profile", AdministrationModuleProfilesController::class);
    Route::ApiResource("/api/reports-module", ReportModuleController::class);
    Route::ApiResource("/api/plans-module", FlightPlanModuleController::class);
    Route::get("/api/plans-module-download/{filename}", [FlightPlanModuleController::class, "getFlightPlanFile"]);
    Route::ApiResource("/api/orders-module", ServiceOrderModuleController::class);
    Route::ApiResource("/api/incidents-module", IncidentModuleController::class);
    Route::ApiResource("/api/equipments-module-drone", EquipmentModuleDronePanelController::class);
    Route::ApiResource("/api/equipments-module-battery", EquipmentModuleBatteryPanelController::class);
    Route::ApiResource("/api/equipments-module-equipment", EquipmentModuleEquipmentPanelController::class);
    // Actions
    Route::post('/api/get-auth-data', LoadAuthData::class); 
    Route::get("/api/load-users", LoadUsersController::class);
    Route::get("/api/load-profiles", LoadProfilesController::class);
    Route::get("/api/load-flight_plans", LoadFlightPlansController::class);
    Route::get("/api/load-incidents", LoadIncidentsController::class);
    Route::get("/api/load-reports", LoadReportsController::class);
});



