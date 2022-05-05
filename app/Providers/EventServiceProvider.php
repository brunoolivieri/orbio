<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
// Custom Events
use App\Events\Auth\UserLoggedInEvent;
use App\Events\Auth\TokenForChangePasswordEvent;
use App\Events\User\UserPasswordChangedEvent;
use App\Events\Modules\Admin\UserCreatedEvent;
// Custom Listeners
use App\Listeners\Auth\UserLoggedInEventListener;
use App\Listeners\Auth\TokenForChangePasswordEventListener;
use App\Listeners\User\UserChangedPasswordEventListener;
use App\Listeners\Modules\Admin\UserCreatedEventListener;
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
        UserLoggedInEvent::class => [
            UserLoggedInEventListener::class
        ],
        TokenForChangePasswordEvent::class => [
            TokenForChangePasswordEventListener::class
        ],
        UserPasswordChangedEvent::class => [
            UserChangedPasswordEventListener::class
        ],
        UserCreatedEvent::class => [
            UserCreatedEventListener::class
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
