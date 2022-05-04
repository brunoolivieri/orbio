<?php

namespace App\Listeners\Auth;

use App\Events\Auth\UserLoggedInEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Model
use App\Models\User\UserModel;
// Custom Mail
use App\Mail\Auth\LogInNotification;


class UserLoggedInEventListener
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
     * Update the last access of the user that made the login.
     * Send notification of the login for him.
     *
     * @param  \App\Events\UserLoggedInEvent  $event
     * @return void
     */
    public function handle(UserLoggedInEvent $event)
    {    
        UserModel::where("id", $event->user_id)->update(["dh_ultimo_acesso" => date("Y-m-d H:i:s")]);

        Mail::to($event->email)->send(new LogInNotification($event->name, $event->profile, $event->datetime));
    }
}
