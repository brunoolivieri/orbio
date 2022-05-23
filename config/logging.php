<?php

use Monolog\Handler\NullHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\SyslogUdpHandler;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that gets used when writing
    | messages to the logs. The name specified in this option should match
    | one of the channels defined in the "channels" configuration array.
    |
    */

    'default' => env('LOG_CHANNEL', 'stack'),

    /*
    |--------------------------------------------------------------------------
    | Deprecations Log Channel
    |--------------------------------------------------------------------------
    |
    | This option controls the log channel that should be used to log warnings
    | regarding deprecated PHP and library features. This allows you to get
    | your application ready for upcoming major versions of dependencies.
    |
    */

    'deprecations' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),

    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Out of
    | the box, Laravel uses the Monolog PHP logging library. This gives
    | you a variety of powerful log handlers / formatters to utilize.
    |
    | Available Drivers: "single", "daily", "slack", "syslog",
    |                    "errorlog", "monolog",
    |                    "custom", "stack"
    |
    */

    'channels' => [
        'stack' => [
            'driver' => 'stack',
            'channels' => ['single'],
            'ignore_exceptions' => false,
        ],

        'single' => [
            'driver' => 'single',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
        ],

        'login_action' => [
            'driver' => 'single',
            'path' => storage_path('logs/login/actions.log'),
            'level' => "info",
        ],

        'login_error' => [
            'driver' => 'single',
            'path' => storage_path('logs/login/errors.log'),
            'level' => "error",
        ],

        'mail' => [
            'driver' => 'single',
            'path' => storage_path('logs/mails/actions.log'),
            'level' => "info",
        ],

        'user' => [
            'driver' => 'single',
            'path' => storage_path('logs/user/actions.log'),
            'level' => "error",
        ],

        'administration_action' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/administration/actions.log'),
            'level' => "info",
        ],

        'administration_error' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/administration/errors.log'),
            'level' => "error",
        ],

        'flight_plans_action' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/flight_plans/actions.log'),
            'level' => "info",
        ],

        'flight_plans_error' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules//flight_plans/errors.log'),
            'level' => "error",
        ],

        'service_orders_action' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/service_orders/actions.log'),
            'level' => "info",
        ],

        'service_orders_error' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/service_orders/errors.log'),
            'level' => "error",
        ],

        'equipment_action' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/equipments/action.log'),
            'level' => "info",
        ],

        'equipment_error' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/equipments/error.log'),
            'level' => "error",
        ],

        'reports_action' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/reports/actions.log'),
            'level' => "info",
        ],

        'reports_error' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/reports/errors.log'),
            'level' => "error",
        ],

        'incidents_action' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/incidents/actions.log'),
            'level' => "info",
        ],

        'incidents_error' => [
            'driver' => 'single',
            'path' => storage_path('logs/modules/incidents/errors.log'),
            'level' => "error",
        ],

    ],

];
