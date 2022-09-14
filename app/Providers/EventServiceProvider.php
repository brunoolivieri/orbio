<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
// Events
use App\Events\Auth\FirstSuccessfulLoginEvent;
use App\Events\Auth\LoginSuccessfulEvent;
//Listeners
use App\Listeners\Auth\Login\FirstLoginSuccessfulListener;
use App\Listeners\Auth\Login\LoginSuccessfulListener;
// Models
use App\Models\ServiceOrders\ServiceOrder;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        LoginSuccessfulEvent::class => [
            LoginSuccessfulListener::class
        ],
        FirstSuccessfulLoginEvent::class => [
            FirstLoginSuccessfulListener::class
        ]
    ];

    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
        ServiceOrder::class => [ServiceOrderObserver::class]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
