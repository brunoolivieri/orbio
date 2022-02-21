<?php

namespace App\Listeners;

use App\Events\UserSuccessfulLoginEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UserLastLoginListener
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
     * @param  \App\Events\UserSuccessfulLoginEvent  $event
     * @return void
     */
    public function handle(UserSuccessfulLoginEvent $event)
    {
        
        $event->user->dh_ultimo_acesso = date("Y-m-d H:i:s");
        $event->user->save();

    }
}
