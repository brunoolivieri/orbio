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
    Actions\WeatherDataController,
    Actions\DownloadReportController
};
use App\Http\Controllers\Modules\FlightPlan\{
    FlightPlanModuleController,
    FlightPlanModuleLogController,
    Actions\UploadedLogsController,
    Actions\DownloadFlightPlanController,
    Actions\DownloadFlightPlanCSVController,
    Actions\DownloadLogController
};
use App\Http\Controllers\Modules\ServiceOrder\{
    ServiceOrderModuleController,
    Actions\FlightPlansForServiceOrderController,
    Actions\EquipmentsForServiceOrderFlightPlanController, // For equipments table
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
        Route::get('/dashboard-data', DashboardController::class);
        Route::apiResource("/module/administration-user", AdministrationModuleUsersController::class);
        Route::apiResource("/module/administration-profile", AdministrationModuleProfilesController::class);
        Route::apiResource("/module/reports", ReportModuleController::class);
        Route::apiResource("/module/flight-plans", FlightPlanModuleController::class);
        Route::apiResource("/module/flight-plans-logs", FlightPlanModuleLogController::class);
        Route::apiResource("/module/service-orders", ServiceOrderModuleController::class);
        Route::apiResource("/module/equipments-drone", EquipmentModuleDroneController::class);
        Route::apiResource("/module/equipments-battery", EquipmentModuleBatteryController::class);
        Route::apiResource("/module/equipments", EquipmentModuleEquipmentController::class);
        // Module export CSV 
        Route::post("/users/export", [AdministrationModuleUsersController::class, "exportTableAsCsv"]);
        Route::post("/profiles/export", [AdministrationModuleProfilesController::class, "exportTableAsCsv"]);
        Route::post("/flight-plans/export", [FlightPlanModuleController::class, "exportTableAsCsv"]);
        Route::post("/logs/export", [FlightPlanModuleLogController::class, "exportTableAsCsv"]);
        Route::post("/service-orders/export", [ServiceOrderModuleController::class, "exportTableAsCsv"]);
        Route::post("/reports/export", [ReportModuleController::class, "exportTableAsCsv"]);
        Route::post("/drones/export", [EquipmentModuleDroneController::class, "exportTableAsCsv"]);
        Route::post("/batteries/export", [EquipmentModuleBatteryController::class, "exportTableAsCsv"]);
        Route::post("/equipments/export", [EquipmentModuleEquipmentController::class, "exportTableAsCsv"]);
        Route::get("/log/download/{filename}", DownloadLogController::class);
        // Module Actions
        Route::get("/action/service-order/flight-plans", FlightPlansForServiceOrderController::class);
        Route::get("/action/service-order/logs", LogsForServiceOrderFlightPlanController::class);
        Route::apiResource("/action/service-order/incidents", ServiceOrderIncidentController::class);
        Route::get("/action/report/service-orders", LoadServiceOrderForReport::class);
        Route::post("/action/flight-plans-logs/processing-uploads", UploadedLogsController::class);
        Route::get("/action/report/weather-data", WeatherDataController::class);
        Route::get("/action/service-orders/{flight_plan_id}", LoadServiceOrderByFlightPlanController::class);
        Route::get("/action/flight-plans/download", DownloadFlightPlanController::class);
        Route::get("/action/flight-plans/download-csv", DownloadFlightPlanCSVController::class);
        Route::get("/action/reports/download/{filename}", DownloadReportController::class);
        // Generic Actions
        Route::get('/action/load-drones', LoadDronesController::class);
        Route::get('/action/load-batteries', LoadBatteriesController::class);
        Route::get('/action/load-equipments', LoadEquipmentsController::class);
        Route::get("/action/load-users", LoadUsersController::class);
        Route::get("/action/load-profiles", LoadProfilesController::class);
        Route::get("/action/load-flight-plans", LoadFlightPlansController::class);
        Route::get("/action/load-service-orders", LoadServiceOrdersController::class);
        Route::get("/action/load-incidents", LoadIncidentsController::class);
        Route::get("/action/load-reports", LoadReportsController::class);
        Route::get("/action/load-logs", LoadLogsController::class);
        // Module "MyProfile" operations
        Route::get("/myprofile/basic-data", [MyProfileController::class, "loadBasicData"]);
        Route::patch("/myprofile/basic-data", [MyProfileController::class, "basicDataUpdate"]);
        Route::get("/myprofile/documents", [MyProfileController::class, "loadDocuments"]);
        Route::patch("/myprofile/documents", [MyProfileController::class, "documentsUpdate"]);
        Route::get("/myprofile/address", [MyProfileController::class, "loadAddress"]);
        Route::patch("/myprofile/address", [MyProfileController::class, "addressUpdate"]);
        Route::delete("/myprofile/deactivation/{user_id}", [MyProfileController::class, "accountDeactivation"]);
        Route::patch("/myprofile/change-password/{user_id}", [MyProfileController::class, "passwordUpdate"]);
    });
});
