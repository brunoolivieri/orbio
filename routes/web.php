<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Pages\{
    ReactController,
    MapController,
    MapIframeController
};
use App\Http\Controllers\Authentication\{
    LoginController,
    LogoutController,
    PasswordResetController,
    PasswordTokenController,
    UserAuthenticatedData
};
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
use App\Http\Controllers\Modules\Equipment\{
    EquipmentModuleBatteryController,
    EquipmentModuleDroneController,
    EquipmentModuleEquipmentController
};
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

// Guest views
Route::redirect('/', '/login');
Route::middleware(['guest'])->group(function () {
    Route::get("/login", ReactController::class);
    Route::get("/forgot-password", ReactController::class);
});

// Views that neeed authentication
Route::middleware(["session.auth"])->group(function () {
    Route::get("/{internal?}", ReactController::class)->where(["internal" => "^(?!api|login|forgot-password|map(?:-modal)?).*"]);
    Route::get('/map', MapController::class);
    Route::get("/map-modal", MapIframeController::class);
});

// Api routes
Route::group(["prefix" => "api"], function () {
    Route::post('/login', LoginController::class);
    Route::post('/get-password-token', PasswordTokenController::class);
    Route::post('/change-password', PasswordResetController::class);
    Route::middleware(["session.auth"])->group(function () {
        Route::get('/user-data', UserAuthenticatedData::class);
        Route::post('/logout', LogoutController::class);
        // Module core operations
        Route::get('dashboard-data', DashboardController::class);
        Route::apiResource("module/administration-user", AdministrationModuleUsersController::class);
        Route::apiResource("module/administration-profile", AdministrationModuleProfilesController::class);
        Route::apiResource("module/reports", ReportModuleController::class);
        Route::apiResource("module/flight-plans", FlightPlanModuleController::class);
        Route::apiResource("module/flight-plans-logs", FlightPlanModuleLogController::class);
        Route::apiResource("module/service-orders", ServiceOrderModuleController::class);
        Route::apiResource("module/equipments-drone", EquipmentModuleDroneController::class);
        Route::apiResource("module/equipments-battery", EquipmentModuleBatteryController::class);
        Route::apiResource("module/equipments", EquipmentModuleEquipmentController::class);
        // Module export CSV and download files if exists
        Route::post("users/export", [AdministrationModuleUsersController::class, "exportTableAsCsv"]);
        Route::post("profiles/export", [AdministrationModuleProfilesController::class, "exportTableAsCsv"]);
        Route::post("flight-plans/export", [FlightPlanModuleController::class, "exportTableAsCsv"]);
        Route::post("logs/export", [FlightPlanModuleLogController::class, "exportTableAsCsv"]);
        Route::post("service-orders/export", [ServiceOrderModuleController::class, "exportTableAsCsv"]);
        Route::post("reports/export", [ReportModuleController::class, "exportTableAsCsv"]);
        Route::post("drones/export", [EquipmentModuleDroneController::class, "exportTableAsCsv"]);
        Route::post("batteries/export", [EquipmentModuleBatteryController::class, "exportTableAsCsv"]);
        Route::post("equipments/export", [EquipmentModuleEquipmentController::class, "exportTableAsCsv"]);
        Route::get("plans-module-download/{filename}", [FlightPlanModuleController::class, "downloadFlightPlan"]);
        Route::get("reports-module-download/{filename}", [ReportModuleController::class, "downloadReport"]);
        Route::get("logs-module-download/{filename}", [FlightPlanModuleLogController::class, "downloadLog"]);
        Route::post("process-selected-logs", [FlightPlanModuleLogController::class, "processSelectedLogs"]);
        // Module "MyProfile" operations
        Route::get("myprofile/basic-data", [MyProfileController::class, "loadBasicData"]);
        Route::patch("myprofile/basic-data", [MyProfileController::class, "basicDataUpdate"]);
        Route::get("myprofile/documents", [MyProfileController::class, "loadDocuments"]);
        Route::patch("myprofile/documents", [MyProfileController::class, "documentsUpdate"]);
        Route::get("myprofile/address", [MyProfileController::class, "loadAddress"]);
        Route::patch("myprofile/address", [MyProfileController::class, "addressUpdate"]);
        Route::delete("myprofile/deactivation/{user_id}", [MyProfileController::class, "accountDeactivation"]);
        Route::patch("myprofile/change-password/{user_id}", [MyProfileController::class, "passwordUpdate"]);
        // Module Actions
        Route::get("/service-order/flight-plans", FlightPlansForServiceOrderController::class);
        Route::get("/service-order/logs", LogsForServiceOrderFlightPlanController::class);
        Route::apiResource("/service-order/incidents", ServiceOrderIncidentController::class);
        Route::get("/load-service-orders-for-report", LoadServiceOrderForReport::class); // To refact
        Route::get("/get-weather-data", WeatherDataController::class); // To refact
        Route::get("/load-service-orders/{flight_plan_id}", LoadServiceOrderByFlightPlanController::class); // To refact
        // Generic Actions
        Route::get('load-drones', LoadDronesController::class);
        Route::get('load-batteries', LoadBatteriesController::class);
        Route::get('load-equipments', LoadEquipmentsController::class);
        Route::get("load-users", LoadUsersController::class);
        Route::get("load-profiles", LoadProfilesController::class);
        Route::get("load-flight-plans", LoadFlightPlansController::class);
        Route::get("load-service-orders", LoadServiceOrdersController::class);
        Route::get("load-incidents", LoadIncidentsController::class);
        Route::get("load-reports", LoadReportsController::class);
        Route::get("load-logs", LoadLogsController::class);
    });
});
