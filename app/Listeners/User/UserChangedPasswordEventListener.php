<?php

namespace App\Listeners\User;

use App\Events\User\UserPasswordChangedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Custom Mail
use App\Mail\User\PasswordChangedNotification;

class UserChangedPasswordEventListener
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
     * @param  \App\Events\UserPasswordChangedEvent  $event
     * @return void
     */
    public function handle(UserPasswordChangedEvent $event)
    {
        Mail::to($event->email)->send(new PasswordChangedNotification($event->name, $event->datetime));
    }
}
