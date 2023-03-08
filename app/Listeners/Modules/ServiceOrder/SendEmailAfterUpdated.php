<?php

namespace App\Listeners\Modules\ServiceOrder;

use App\Notifications\Modules\ServiceOrder\ServiceOrderUpdatedNotification;

class SendEmailAfterUpdated
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
            if ($user->pivot->role === "creator") {
                $user->notify(new ServiceOrderUpdatedNotification($service_order));
            } else if ($user->pivot->role === "pilot") {
                $user->notify(new ServiceOrderUpdatedNotification($service_order));
            } else if ($user->pivot->role === "client") {
                $user->notify(new ServiceOrderUpdatedNotification($service_order));
            }
        }
    }
}
