<?php

namespace App\Listeners\Modules\ServiceOrder;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
// Notification
use App\Notifications\Modules\ServiceOrder\ServiceOrderCreatedNotification;

class SendEmailAfterCreated
{

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        $service_order = $event->service_order;

        foreach ($service_order->users as $user) {
           
            if($user->pivot->role === "creator"){
                $creator = $user;
            }else if ($user->pivot->role === "pilot") {
                $pilot = $user;
            } else if ($user->pivot->role === "client") {
                $client = $user;
            }
        }

        $creator->notify(new ServiceOrderCreatedNotification($creator, $service_order));
        $pilot->notify(new ServiceOrderCreatedNotification($pilot, $service_order));
        $client->notify(new ServiceOrderCreatedNotification($client, $service_order));
    }
}
