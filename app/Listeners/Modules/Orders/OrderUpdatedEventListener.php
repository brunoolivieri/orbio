<?php

namespace App\Listeners\Modules\Orders;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Events
use App\Events\Modules\Orders\OrderUpdatedEvent;
// Custom Mail
use App\Mail\Order\OrderUpdatedMail;

class OrderUpdatedEventListener
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
    public function handle(OrderUpdatedEvent $event)
    {
        if($event->service_order->wasChanged('start_date')){

            Mail::to()->cc([])->queue(new OrderUpdatedMail());

        }if($event->service_order->wasChanged('end_date')){

            Mail::to()->cc([])->queue(new OrderUpdatedMail());

        }else if($event->service_order->wasChanged('pilot_name')){

            Mail::to()->cc([])->queue(new OrderUpdatedMail());

        }else if($event->service_order->wasChanged('client_name')){

            Mail::to()->cc([])->queue(new OrderUpdatedMail());

        }
    }
}
