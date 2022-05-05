<?php

namespace App\Listeners\Modules\Admin;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Custom Mail
use App\Mail\User\CreatedNewUserData;

class UserCreatedEventListener
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
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        Mail::to($event->email)->send(new CreatedNewUserData($event->name, $event->email, $event->profile, $event->password, $event->datetime));
    }
}
