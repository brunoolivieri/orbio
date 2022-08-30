<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
// Observers
use App\Observers\ServiceOrderObserver;
use App\Observers\UserObserver;
// Models
use App\Models\User\UserModel;
use App\Models\Orders\ServiceOrderModel;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        //Event::class => [
        //EventListener::class
        //]

    ];

    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
        UserModel::class => [UserObserver::class],
        ServiceOrderModel::class => [ServiceOrderObserver::class]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        UserModel::observe(UserObserver::class);
        ServiceOrderModel::observe(ServiceOrderObserver::class);
    }
}
