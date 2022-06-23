<?php

namespace App\Listeners\Auth;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Custom Mail
use App\Mail\Auth\TokenForChangePasswordMail;

class RequestedTokenEventListener
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
     * @param  \App\Events\RequestedTokenEvent $event
     * @return void
     */
    public function handle($event)
    {
        Mail::to($event->email)->queue(new TokenForChangePasswordMail($event->name, $event->token, $event->datetime));
    }
}
