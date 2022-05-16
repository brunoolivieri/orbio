<?php

namespace App\Listeners\User;

use App\Events\User\UserAccountDesactivatedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Custom Mail
use App\Mail\User\UserAccountDesactivationNotification;

class UserAccountDesactivatedEventListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\UserAccountDesactivatedEvent  $event
     * @return void
     */
    public function handle(UserAccountDesactivatedEvent $event)
    {
        Mail::to($event->email)->send(new UserAccountDesactivationNotification($event->name, $event->email, $event->datetime));
    }
}
