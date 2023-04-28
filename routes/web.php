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
    Users\AdministrationModuleUsersController,
    Users\Actions\UserAdditionalDataController,
    Profiles\AdministrationModuleProfilesController,
    Profiles\Actions\ProfileAdditionalDataController
};
use App\Http\Controllers\Modules\Reports\{
    ReportsModuleController,
    Actions\WeatherDataController,
    Actions\DownloadReportController,
    Actions\ServiceOrdersForReport,
    Actions\ReportAdditionalDataController
};
use App\Http\Controllers\Modules\FlightPlans\{
    FlightPlansModuleController,
    Actions\DownloadFlightPlanController,
    Actions\DownloadFlightPlanCSVController,
    Actions\DownloadFlightPlanFilesToOpenOnMap,
    Actions\FlightPlanAdditionalDataController
};
use App\Http\Controllers\Modules\Logs\{
    LogsModuleController,
    Actions\DownloadLogController,
    Actions\UploadedLogsProcessingController,
    Actions\LogAdditionalDataController
};
use App\Http\Controllers\Modules\ServiceOrders\{
    ServiceOrdersModuleController,
    Actions\FlightPlansForServiceOrderController,
    Actions\DronesForServiceOrderFlightPlanController,
    Actions\BatteriesForServiceOrderFlightPlanController,
    Actions\EquipmentsForServiceOrderFlightPlanController,
    Actions\LogsForServiceOrderFlightPlanController,
    Actions\ServiceOrderIncidentController,
    Actions\ServiceOrderAdditionalDataController
};
use App\Http\Controllers\Modules\Equipments\{
    Batteries\EquipmentModuleBatteryController,
    Batteries\Actions\BatteryAdditionalDataController,
    Drones\EquipmentModuleDroneController,
    Drones\Actions\DroneAdditionalDataController,
    OtherEquipments\EquipmentModuleEquipmentController,
    OtherEquipments\Actions\EquipmentAdditionalDataController
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
            Route::apiResource("/reports", ReportsModuleController::class);
            Route::apiResource("/flight-plans", FlightPlansModuleController::class);
            Route::apiResource("/flight-plans-logs", LogsModuleController::class);
            Route::apiResource("/service-orders", ServiceOrdersModuleController::class);
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
            Route::post("/flight-plans/table-export", [FlightPlansModuleController::class, "exportTableAsCsv"]);
            Route::post("/flight-plans-logs/table-export", [LogsModuleController::class, "exportTableAsCsv"]);
            Route::post("/service-orders/table-export", [ServiceOrdersModuleController::class, "exportTableAsCsv"]);
            Route::post("/reports/table-export", [ReportsModuleController::class, "exportTableAsCsv"]);
            Route::post("/equipments-drone/table-export", [EquipmentModuleDroneController::class, "exportTableAsCsv"]);
            Route::post("/equipments-battery/table-export", [EquipmentModuleBatteryController::class, "exportTableAsCsv"]);
            Route::post("/equipments/table-export", [EquipmentModuleEquipmentController::class, "exportTableAsCsv"]);
            // Modules actions
            Route::group(["prefix" => "/action"], function () {
                // Admin users actions
                Route::get("/users/additional-data", UserAdditionalDataController::class);
                // Admin profiles actions
                Route::get("/profiles/additional-data", ProfileAdditionalDataController::class);
                // Flight plans actions
                Route::get("/flight-plans/download", DownloadFlightPlanController::class);
                Route::get("/flight-plans/download-csv", DownloadFlightPlanCSVController::class);
                Route::get("/flight-plans/download-to-map/{id}", DownloadFlightPlanFilesToOpenOnMap::class);
                Route::get("/flight-plans/additional-data", FlightPlanAdditionalDataController::class);
                // Logs actions
                Route::post("/flight-plans-logs/upload-processing", UploadedLogsProcessingController::class);
                Route::get("/flight-plans-logs/download/{filename}", DownloadLogController::class);
                Route::get("/flight-plans-logs/additional-data", LogAdditionalDataController::class);
                // Service order actions
                Route::get("/service-orders/flight-plans", FlightPlansForServiceOrderController::class);
                Route::get("/service-orders/logs", LogsForServiceOrderFlightPlanController::class);
                Route::apiResource("/service-orders/incidents", ServiceOrderIncidentController::class);
                Route::get("/service-orders/drones", DronesForServiceOrderFlightPlanController::class);
                Route::get("/service-orders/batteries", BatteriesForServiceOrderFlightPlanController::class);
                Route::get("/service-orders/equipments", EquipmentsForServiceOrderFlightPlanController::class);
                Route::get("/service-orders/additional-data", ServiceOrderAdditionalDataController::class);
                // Reports actions
                Route::get("/reports/service-orders", ServiceOrdersForReport::class);
                Route::get("/reports/weather-data", WeatherDataController::class);
                Route::get("/reports/download/{filename}", DownloadReportController::class);
                Route::get("/reports/additional-data", ReportAdditionalDataController::class);
                // Equipments actions
                Route::get("/equipments-drone/additional-data", DroneAdditionalDataController::class);
                Route::get("/equipments-battery/additional-data", BatteryAdditionalDataController::class);
                Route::get("/equipments/additional-data", EquipmentAdditionalDataController::class);
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
