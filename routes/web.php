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
    Actions\UploadedLogsProcessingController,
    Actions\DownloadFlightPlanController,
    Actions\DownloadFlightPlanCSVController,
    Actions\DownloadLogController,
    Actions\DownloadFlightPlanFilesByID
};
use App\Http\Controllers\Modules\ServiceOrder\{
    ServiceOrderModuleController,
    Actions\FlightPlansForServiceOrderController,
    Actions\DronesForServiceOrderFlightPlanController,
    Actions\BatteriesForServiceOrderFlightPlanController,
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
        Route::group(["prefix" => "/module"], function () {
            Route::get("/dashboard", DashboardController::class);
            Route::apiResource("/administration-user", AdministrationModuleUsersController::class);
            Route::apiResource("/administration-profile", AdministrationModuleProfilesController::class);
            Route::apiResource("/reports", ReportModuleController::class);
            Route::apiResource("/flight-plans", FlightPlanModuleController::class);
            Route::apiResource("/flight-plans-logs", FlightPlanModuleLogController::class);
            Route::apiResource("/service-orders", ServiceOrderModuleController::class);
            Route::apiResource("/equipments-drone", EquipmentModuleDroneController::class);
            Route::apiResource("/equipments-battery", EquipmentModuleBatteryController::class);
            Route::apiResource("/equipments", EquipmentModuleEquipmentController::class);
            // Module "MyProfile" - refact to resource controller
            Route::get("/my-profile/basic-data", [MyProfileController::class, "loadBasicData"]);
            Route::patch("/my-profile/basic-data", [MyProfileController::class, "basicDataUpdate"]);
            Route::get("/my-profile/documents", [MyProfileController::class, "loadDocuments"]);
            Route::patch("/my-profile/documents", [MyProfileController::class, "documentsUpdate"]);
            Route::get("/my-profile/address", [MyProfileController::class, "loadAddress"]);
            Route::patch("/my-profile/address", [MyProfileController::class, "addressUpdate"]);
            Route::delete("/my-profile/deactivation/{user_id}", [MyProfileController::class, "accountDeactivation"]);
            Route::patch("/my-profile/change-password/{user_id}", [MyProfileController::class, "passwordUpdate"]);
            // Export tables as xlsx
            Route::post("/administration-user/table-export", [AdministrationModuleUsersController::class, "exportTableAsCsv"]);
            Route::post("/administration-profile/table-export", [AdministrationModuleProfilesController::class, "exportTableAsCsv"]);
            Route::post("/flight-plans/table-export", [FlightPlanModuleController::class, "exportTableAsCsv"]);
            Route::post("/flight-plans-logs/table-export", [FlightPlanModuleLogController::class, "exportTableAsCsv"]);
            Route::post("/service-orders/table-export", [ServiceOrderModuleController::class, "exportTableAsCsv"]);
            Route::post("/reports/table-export", [ReportModuleController::class, "exportTableAsCsv"]);
            Route::post("/equipments-drone/table-export", [EquipmentModuleDroneController::class, "exportTableAsCsv"]);
            Route::post("/equipments-battery/table-export", [EquipmentModuleBatteryController::class, "exportTableAsCsv"]);
            Route::post("/equipments/table-export", [EquipmentModuleEquipmentController::class, "exportTableAsCsv"]);
            // Modules actions
            Route::group(["prefix" => "/action"], function () {
                // Flight plans actions
                Route::get("/flight-plans/download", DownloadFlightPlanController::class);
                Route::get("/flight-plans/download-csv", DownloadFlightPlanCSVController::class);
                Route::get("/flight-plans/download-to-map/{id}", DownloadFlightPlanFilesByID::class);
                // Logs actions
                Route::post("/flight-plans-logs/upload-processing", UploadedLogsProcessingController::class);
                Route::get("/flight-plans-logs/download/{filename}", DownloadLogController::class);
                // Service order actions
                Route::get("/service-orders/flight-plans", FlightPlansForServiceOrderController::class);
                Route::get("/service-orders/logs", LogsForServiceOrderFlightPlanController::class);
                Route::apiResource("/service-orders/incidents", ServiceOrderIncidentController::class);
                Route::get("/service-orders/drones", DronesForServiceOrderFlightPlanController::class);
                Route::get("/service-orders/batteries", BatteriesForServiceOrderFlightPlanController::class);
                Route::get("/service-orders/equipments", EquipmentsForServiceOrderFlightPlanController::class);
                // Reports actions
                Route::get("/reports/service-orders", LoadServiceOrderForReport::class);
                Route::get("/reports/weather-data", WeatherDataController::class);
                Route::get("/reports/download/{filename}", DownloadReportController::class);
            });
        });
        // Generic actions
        Route::group(["prefix" => "/action"], function () {
            Route::get('/load-drones', LoadDronesController::class);
            Route::get('/load-batteries', LoadBatteriesController::class);
            Route::get('/load-equipments', LoadEquipmentsController::class);
            Route::get("/load-users", LoadUsersController::class);
            Route::get("/load-profiles", LoadProfilesController::class);
            Route::get("/load-flight-plans", LoadFlightPlansController::class);
            Route::get("/load-service-orders", LoadServiceOrdersController::class);
            Route::get("/load-incidents", LoadIncidentsController::class);
            Route::get("/load-reports", LoadReportsController::class);
            Route::get("/load-logs", LoadLogsController::class);
        });
    });
});
