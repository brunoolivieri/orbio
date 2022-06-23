<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
// Custom Events
use App\Events\Auth\LoginEvent;
use App\Events\Auth\RequestedTokenEvent;
use App\Events\User\UserPasswordChangedEvent;
use App\Events\Modules\Admin\UserCreatedEvent;
use App\Events\User\UserAccountDesactivatedEvent;
use  App\Events\Modules\Orders\OrderCreatedEvent;
// Custom Listeners
use App\Listeners\Auth\LoginEventListener;
use App\Listeners\Auth\RequestedTokenEventListener;
use App\Listeners\User\UserChangedPasswordEventListener;
use App\Listeners\Modules\Admin\UserCreatedEventListener;
use App\Listeners\User\UserAccountDesactivatedEventListener;
use App\Listeners\Modules\Orders\OrderCreatedEventListener;
// Custom Observers
use App\Observers\UserModelObserver;
// Custom Model
use App\Models\User\UserModel;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        LoginEvent::class => [
            LoginEventListener::class
        ],
        RequestedTokenEvent::class => [
            RequestedTokenEventListener::class
        ],
        UserPasswordChangedEvent::class => [
            UserChangedPasswordEventListener::class
        ],
        UserCreatedEvent::class => [
            UserCreatedEventListener::class
        ],
        UserAccountDesactivatedEvent::class => [
            UserAccountDesactivatedEventListener::class
        ],
        OrderCreatedEvent::class => [
            OrderCreatedEventListener::class
        ]

    ];

    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
        //UserModel::class => [UserModelObserver::class],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //UserModel::observe(UserModelObserver::class);
    }
}
