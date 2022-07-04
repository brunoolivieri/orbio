<?php

namespace App\Listeners\Auth;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Model
use App\Models\User\UserModel;
// Custom Mail
use App\Mail\Auth\LogInNotification;

class LoginEventListener
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
        UserModel::where("id", $event->user_id)->update(["last_access" => date("Y-m-d H:i:s")]);
        Mail::to($event->email)->send(new LogInNotification($event->name, $event->profile, $event->datetime));
    }
}
