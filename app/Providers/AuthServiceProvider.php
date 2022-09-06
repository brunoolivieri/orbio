<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Users\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // === ADMINISTRATION GATES === //

        Gate::define("administration_read", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[0]["read"];
        });

        Gate::define("administration_write", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[0]["write"];
        });

        // === FLIGHT PLANS GATES === //

        Gate::define("flight_plans_read", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[1]["read"];
        });

        Gate::define("flight_plans_write", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[1]["write"];
        });

        // === SERVICE ORDERS GATES === //

        Gate::define("service_orders_read", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[2]["read"];
        });

        Gate::define("service_orders_write", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[2]["write"];
        });

        // === REPORTS GATES === //

        Gate::define("reports_read", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[3]["read"];
        });

        Gate::define("reports_write", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[3]["write"];
        });

        // === INCIDENTS GATES === //

        Gate::define("incidents_read", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[4]["read"];
        });

        Gate::define("incidents_write", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[4]["write"];
        });

        // === EQUIPMENTS GATES === //

        Gate::define("equipments_read", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[5]["read"];
        });

        Gate::define("equipments_write", function (User $logged_user): bool {

            return $logged_user->profile->module_privileges[5]["write"];
        });
    }
}
