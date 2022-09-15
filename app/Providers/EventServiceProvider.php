<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
// Events
use App\Events\Auth\{
    FirstSuccessfulLoginEvent,
    LoginSuccessfulEvent
};
use App\Events\Modules\ServiceOrder\ServiceOrderCreatedEvent;
use App\Events\Modules\ServiceOrder\ServiceOrderUpdatedEvent;
use App\Events\Modules\ServiceOrder\ServiceOrderDeletedEvent;
//Listeners
use App\Listeners\Auth\Login\{
    FirstLoginSuccessfulListener,
    LoginSuccessfulListener
};
use App\Listeners\Modules\ServiceOrder\{
    SendEmailAfterCreated,
    SendEmailAfterUpdated,
    SendEmailAfterDeleted
};
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
        ],
        ServiceOrderCreatedEvent::class => [
            SendEmailAfterCreated::class
        ],
        ServiceOrderUpdatedEvent::class => [
            SendEmailAfterUpdated::class
        ],
        ServiceOrderDeletedEvent::class => [
            SendEmailAfterDeleted::class
        ]
    ];

    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
        //
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
