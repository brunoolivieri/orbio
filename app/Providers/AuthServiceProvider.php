<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User\UserModel;

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

        Gate::define("administration_read", function(UserModel $user) : bool {

            return $user->profile->module_privileges[0]["ler"];

        }); 

        Gate::define("administration_write", function(UserModel $user) : bool {

            return $user->profile->module_privileges[0]["escrever"];

        }); 

        // === FLIGHT PLANS GATES === //

        Gate::define("flight_plans_read", function(UserModel $user) : bool {

            return $user->profile->module_privileges[1]["ler"];

        }); 

        Gate::define("flight_plans_write", function(UserModel $user) : bool {

            return $user->profile->module_privileges[1]["escrever"];

        }); 

        // === SERVICE ORDERS GATES === //

        Gate::define("service_orders_read", function(UserModel $user) : bool {

            return $user->profile->module_privileges[2]["ler"];

        }); 

        Gate::define("service_orders_write", function(UserModel $user) : bool {

            return $user->profile->module_privileges[2]["escrever"];

        }); 

        // === REPORTS GATES === //

        Gate::define("reports_read", function(UserModel $user) : bool {

            return $user->profile->module_privileges[3]["ler"];

        }); 

        Gate::define("reports_write", function(UserModel $user) : bool {

            return $user->profile->module_privileges[3]["escrever"];

        }); 

        // === INCIDENTS GATES === //

        Gate::define("incidents_read", function(UserModel $user) : bool {

            return $user->profile->module_privileges[4]["ler"];

        }); 

        Gate::define("incidents_write", function(UserModel $user) : bool {

            return $user->profile->module_privileges[4]["escrever"];

        }); 

        // === EQUIPMENTS GATES === //

        Gate::define("equipments_read", function(UserModel $user) : bool {

            return $user->profile->module_privileges[5]["ler"];

        }); 

        Gate::define("equipments_write", function(UserModel $user) : bool {

            return $user->profile->module_privileges[5]["escrever"];

        }); 

    }
}
