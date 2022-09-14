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

            return $logged_user->profile->modules[0]->pivot->read;
        });

        Gate::define("administration_write", function (User $logged_user): bool {

            return $logged_user->profile->modules[0]->pivot->write;
        });

        // === FLIGHT PLANS GATES === //

        Gate::define("flight_plans_read", function (User $logged_user): bool {

            return $logged_user->profile->modules[1]->pivot->read;
        });

        Gate::define("flight_plans_write", function (User $logged_user): bool {

            return $logged_user->profile->modules[1]->pivot->write;
        });

        // === SERVICE ORDERS GATES === //

        Gate::define("service_orders_read", function (User $logged_user): bool {

            return $logged_user->profile->modules[2]->pivot->read;
        });

        Gate::define("service_orders_write", function (User $logged_user): bool {

            return $logged_user->profile->modules[2]->pivot->write;
        });

        // === REPORTS GATES === //

        Gate::define("reports_read", function (User $logged_user): bool {

            return $logged_user->profile->modules[3]->pivot->read;
        });

        Gate::define("reports_write", function (User $logged_user): bool {

            return $logged_user->profile->modules[3]->pivot->write;
        });

        // === INCIDENTS GATES === //

        Gate::define("incidents_read", function (User $logged_user): bool {

            return $logged_user->profile->modules[4]->pivot->read;
        });

        Gate::define("incidents_write", function (User $logged_user): bool {

            return $logged_user->profile->modules[4]->pivot->write;
        });

        // === EQUIPMENTS GATES === //

        Gate::define("equipments_read", function (User $logged_user): bool {

            return $logged_user->profile->modules[5]->pivot->read;
        });

        Gate::define("equipments_write", function (User $logged_user): bool {

            return $logged_user->profile->modules[5]->pivot->write;
        });
    }
}
