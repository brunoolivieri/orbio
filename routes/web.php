<?php

use Illuminate\Support\Facades\Route;
// Authentication Actions
use App\Http\Controllers\Actions\Authentication\{
    LoginController,
    LogoutController,
    PasswordResetController,
    PasswordTokenController,
    UserAuthenticatedData
};
// Api Actions
use App\Http\Controllers\Actions\Api\{
    WeatherDataController
};
// Dashboard Action
use App\Http\Controllers\Actions\Dashboard\DashboardController;
// Generic Actions
use App\Http\Controllers\Actions\{
    LoadFlightPlansController,
    LoadIncidentsController,
    LoadProfilesController,
    LoadReportsController,
    LoadUsersController,
    LoadFlightPlansForServiceOrderController,
    LoadServiceOrdersController,
    LoadServiceOrderByFlightPlanController,
    LoadDronesController,
    LoadBatteriesController,
    LoadEquipmentsController,
    LoadServiceOrderForReport,
    LoadLogsController
};
// Internal Controller 
use App\Http\Controllers\Internal\{
    MyAccountController
};
// Modules
use App\Http\Controllers\Modules\Administration\{
    AdministrationModuleUsersController,
    AdministrationModuleProfilesController
};
use App\Http\Controllers\Modules\Report\ReportModuleController;
use App\Http\Controllers\Modules\FlightPlan\{
    FlightPlanModuleController,
    FlightPlanModuleLogController
};
use App\Http\Controllers\Modules\ServiceOrder\ServiceOrderModuleController;
use App\Http\Controllers\Modules\Incident\IncidentModuleController;
use App\Http\Controllers\Modules\Equipment\{
    EquipmentModuleBatteryPanelController,
    EquipmentModuleDronePanelController,
    EquipmentModuleEquipmentPanelController
};

// Views
Route::middleware(['guest'])->group(function () {
    Route::get('/', function () {
        return redirect("/login");
    });
    Route::view('/login', "react_root");
    Route::view('/forgot-password', "react_root");
});


// Guest operations
Route::post('api/auth/login', LoginController::class);
Route::post('api/auth/password-token', PasswordTokenController::class);
Route::post('api/auth/change-password', PasswordResetController::class);

Route::middleware(["session.auth"])->group(function () {
    // Internal simple operations
    Route::view('/internal', "react_root");
    Route::get('/internal/{internalpage?}', function () {
        return redirect("/internal");
    })->where(["internalpage" => "^(?!auth|map).*$"])->name("dashboard");
    Route::view('/internal/map', "map");
    Route::view('/internal/map-modal', "map_modal");
    // Internal Dashboard 
    Route::get('/api/load-dashboard-metrics', DashboardController::class);
    // Internal "MyAccount" operations
    Route::get('api/load-basic-account-data', [MyAccountController::class, "loadBasicData"]);
    Route::get('api/load-complementary-account-data', [MyAccountController::class, "loadComplementaryData"]);
    Route::get('api/load-sessions-data', [MyAccountController::class, "loadActiveSessions"]);
    Route::patch('api/update-basic-data', [MyAccountController::class, "basicDataUpdate"]);
    Route::patch('api/update-documents-data', [MyAccountController::class, "documentsUpdate"]);
    Route::patch('api/update-address-data', [MyAccountController::class, "addressUpdate"]);
    Route::post("api/desactivate-account/{id}", [MyAccountController::class, "accountDesactivation"]);
    Route::post("api/update-password", [MyAccountController::class, "passwordUpdate"]);
    // Internal Modules operations
    Route::ApiResource("api/admin-module-user", AdministrationModuleUsersController::class);
    Route::ApiResource("api/admin-module-profile", AdministrationModuleProfilesController::class);
    Route::ApiResource("api/reports-module", ReportModuleController::class);
    Route::ApiResource("api/plans-module", FlightPlanModuleController::class);
    Route::ApiResource("api/plans-module-logs", FlightPlanModuleLogController::class);
    Route::ApiResource("api/orders-module", ServiceOrderModuleController::class);
    Route::ApiResource("api/incidents-module", IncidentModuleController::class);
    Route::ApiResource("api/equipments-module-drone", EquipmentModuleDronePanelController::class);
    Route::ApiResource("api/equipments-module-battery", EquipmentModuleBatteryPanelController::class);
    Route::ApiResource("api/equipments-module-equipment", EquipmentModuleEquipmentPanelController::class);
    // Internal Modules extra operations
    Route::post("api/users/export", [AdministrationModuleUsersController::class, "exportTableAsCsv"]);
    Route::post("api/profiles/export", [AdministrationModuleProfilesController::class, "exportTableAsCsv"]);
    Route::post("api/flight-plans/export", [FlightPlanModuleController::class, "exportTableAsCsv"]);
    Route::post("api/logs/export", [FlightPlanModuleLogController::class, "exportTableAsCsv"]);
    Route::post("api/service-orders/export", [ServiceOrderModuleController::class, "exportTableAsCsv"]);
    Route::post("api/reports/export", [ReportModuleController::class, "exportTableAsCsv"]);
    Route::post("api/incidents/export", [IncidentModuleController::class, "exportTableAsCsv"]);
    Route::post("api/drones/export", [EquipmentModuleDronePanelController::class, "exportTableAsCsv"]);
    Route::post("api/batteries/export", [EquipmentModuleBatteryPanelController::class, "exportTableAsCsv"]);
    Route::post("api/equipments/export", [EquipmentModuleEquipmentPanelController::class, "exportTableAsCsv"]);
    Route::get("api/plans-module-download/{filename}", [FlightPlanModuleController::class, "downloadFlightPlan"]);
    Route::get("api/reports-module-download/{filename}", [ReportModuleController::class, "downloadReport"]);
    Route::get("api/logs-module-download/{filename}", [FlightPlanModuleLogController::class, "downloadLog"]);
    Route::post("api/process-selected-logs", [FlightPlanModuleLogController::class, "processSelectedLogs"]);
    // Actions
    Route::get('api/auth/logout', LogoutController::class);
    Route::get('api/auth/data', UserAuthenticatedData::class);
    Route::get('api/load-service-orders-for-report', LoadServiceOrderForReport::class);
    Route::get('api/load-drones', LoadDronesController::class);
    Route::get('api/load-batteries', LoadBatteriesController::class);
    Route::get('api/load-equipments', LoadEquipmentsController::class);
    Route::get('api/get-weather-data', WeatherDataController::class);
    Route::get("api/load-users", LoadUsersController::class);
    Route::get("api/load-profiles", LoadProfilesController::class);
    Route::get("api/load-flight-plans", LoadFlightPlansController::class);
    Route::get("api/load-service-orders/{flight_plan_id}", LoadServiceOrderByFlightPlanController::class);
    Route::get("api/load-service-orders", LoadServiceOrdersController::class);
    Route::get("api/load-incidents", LoadIncidentsController::class);
    Route::get("api/load-reports", LoadReportsController::class);
    Route::get("api/load-flight-plans-service-order", LoadFlightPlansForServiceOrderController::class);
    Route::get("api/load-logs", LoadLogsController::class);
});
