<?php

namespace App\Listeners\Auth;

use App\Events\Auth\TokenForChangePasswordEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Custom Mail
use App\Mail\Auth\TokenForChangePasswordMail;

class TokenForChangePasswordEventListener
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
     * @param  \App\Events\TokenForChangePasswordEvent  $event
     * @return void
     */
    public function handle(TokenForChangePasswordEvent $event)
    {
        Mail::to($event->email)->send(new TokenForChangePasswordMail($event->name, $event->token, $event->datetime));
    }
}
