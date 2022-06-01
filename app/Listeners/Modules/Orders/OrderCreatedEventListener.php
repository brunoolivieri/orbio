<?php

namespace App\Listeners\Modules\Orders;

use App\Events\Modules\Orders\OrderCreatedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Custom Mail
use App\Mail\Order\CreatedNewOrderMail;

class OrderCreatedEventListener
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
     * Send the email to the three involved persons.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(OrderCreatedEvent $event)
    {
        Mail::to($event->creator["email"])->queue(new CreatedNewOrderMail($person = $event->creator["first_name"], $event->initial_date, $event->final_date, $event->creator, $event->pilot, $event->client, $event->observation));
        Mail::to($event->pilot["email"])->queue(new CreatedNewOrderMail($person = $event->pilot["first_name"], $event->initial_date, $event->final_date, $event->creator, $event->pilot, $event->client, $event->observation));
        Mail::to($event->client["email"])->queue(new CreatedNewOrderMail($person = $event->client["first_name"], $event->initial_date, $event->final_date, $event->creator, $event->pilot, $event->client, $event->observation));
    }
}
