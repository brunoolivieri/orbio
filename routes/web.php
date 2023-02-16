<?php

use Illuminate\Support\Facades\Route;
// Authentication Actions
use App\Http\Controllers\Authentication\{
    LoginController,
    LogoutController,
    PasswordResetController,
    PasswordTokenController,
    UserAuthenticatedData
};
// Modules and its specific actions
use App\Http\Controllers\Modules\Dashboard\DashboardController;
use App\Http\Controllers\Modules\MyProfile\MyProfileController;
use App\Http\Controllers\Modules\Administration\{
    AdministrationModuleUsersController,
    AdministrationModuleProfilesController
};
use App\Http\Controllers\Modules\Report\{
    ReportModuleController,
    Actions\WeatherDataController
};
use App\Http\Controllers\Modules\FlightPlan\{
    FlightPlanModuleController,
    FlightPlanModuleLogController
};
use App\Http\Controllers\Modules\ServiceOrder\{
    ServiceOrderModuleController,
    Actions\FlightPlansForServiceOrderController,
    Actions\EquipmentsForServiceOrderFlightPlanController,
    Actions\LogsForServiceOrderFlightPlanController,
    Actions\ServiceOrderIncidentController
};
use App\Http\Controllers\Modules\Incident\IncidentModuleController;
use App\Http\Controllers\Modules\Equipment\{
    EquipmentModuleBatteryController,
    EquipmentModuleDroneController,
    EquipmentModuleEquipmentController
};
// Generic Actions
use App\Http\Controllers\Actions\{
    LoadFlightPlansController,
    LoadIncidentsController,
    LoadProfilesController,
    LoadReportsController,
    LoadUsersController,
    LoadServiceOrdersController,
    LoadServiceOrderByFlightPlanController,
    LoadDronesController,
    LoadBatteriesController,
    LoadEquipmentsController,
    LoadServiceOrderForReport,
    LoadLogsController
};

// Views
Route::middleware(['guest'])->group(function () {
    Route::get('/', function () {
        return redirect("/login");
    });
    Route::view('/login', "react_root");
    Route::view('/forgot-password', "react_root");
});

// Auth operations
Route::group(['prefix' => 'api/auth'], function () {
    Route::post('/login', LoginController::class);
    Route::post('/password-token', PasswordTokenController::class);
    Route::post('/change-password', PasswordResetController::class);
    Route::middleware(["session.auth"])->group(function () {
        Route::get('/user-data', UserAuthenticatedData::class);
        Route::post('/logout', LogoutController::class);
    });
});

Route::middleware(["session.auth"])->group(function () {
    Route::view('/internal', "react_root");
    Route::get('/internal/{internalpage?}', function () {
        return redirect("/internal");
    })->where(["internalpage" => "^(?!auth|map).*$"])->name("dashboard");
    Route::view('/internal/map', "map");
    Route::view('/internal/map-modal', "map_modal");
    // Module core operations
    Route::get('/api/dashboard', DashboardController::class);
    Route::apiResource("api/admin-module-user", AdministrationModuleUsersController::class);
    Route::apiResource("api/admin-module-profile", AdministrationModuleProfilesController::class);
    Route::apiResource("api/reports-module", ReportModuleController::class);
    Route::apiResource("api/plans-module", FlightPlanModuleController::class);
    Route::apiResource("api/plans-module-logs", FlightPlanModuleLogController::class);
    Route::apiResource("api/orders-module", ServiceOrderModuleController::class);
    Route::apiResource("api/module/equipments-drone", EquipmentModuleDroneController::class);
    Route::apiResource("api/module/equipments-battery", EquipmentModuleBatteryController::class);
    Route::apiResource("api/module/equipments", EquipmentModuleEquipmentController::class);
    // Module additional operations
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
    // Module "MyProfile" operations
    Route::get('api/myprofile/basic-data', [MyProfileController::class, "loadBasicData"]);
    Route::patch('api/myprofile/basic-data', [MyProfileController::class, "basicDataUpdate"]);
    Route::get('api/myprofile/documents', [MyProfileController::class, "loadDocuments"]);
    Route::patch('api/myprofile/documents', [MyProfileController::class, "documentsUpdate"]);
    Route::get('api/myprofile/address', [MyProfileController::class, "loadAddress"]);
    Route::patch('api/myprofile/address', [MyProfileController::class, "addressUpdate"]);
    Route::delete("api/myprofile/deactivation/{user_id}", [MyProfileController::class, "accountDeactivation"]);
    Route::patch("api/myprofile/change-password/{user_id}", [MyProfileController::class, "passwordUpdate"]);
    // Module actions
    Route::group(["prefix" => "api/action/module"], function () {
        Route::get("/service-order/flight-plans", FlightPlansForServiceOrderController::class);
        Route::get("/service-order/logs", LogsForServiceOrderFlightPlanController::class);
        Route::apiResource("/service-order/incidents", ServiceOrderIncidentController::class);
    });
    Route::get('api/load-service-orders-for-report', LoadServiceOrderForReport::class);
    Route::get('api/get-weather-data', WeatherDataController::class);
    Route::get("api/load-service-orders/{flight_plan_id}", LoadServiceOrderByFlightPlanController::class);
    // Generic actions
    Route::get('api/load-drones', LoadDronesController::class);
    Route::get('api/load-batteries', LoadBatteriesController::class);
    Route::get('api/load-equipments', LoadEquipmentsController::class);
    Route::get("api/load-users", LoadUsersController::class);
    Route::get("api/load-profiles", LoadProfilesController::class);
    Route::get("api/load-flight-plans", LoadFlightPlansController::class);
    Route::get("api/load-service-orders", LoadServiceOrdersController::class);
    Route::get("api/load-incidents", LoadIncidentsController::class);
    Route::get("api/load-reports", LoadReportsController::class);
    Route::get("api/load-logs", LoadLogsController::class);
});
