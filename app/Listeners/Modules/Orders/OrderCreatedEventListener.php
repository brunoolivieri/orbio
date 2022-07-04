<?php

namespace App\Listeners\Modules\Orders;

use App\Events\Modules\Orders\OrderCreatedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
// Custom Mail
use App\Mail\Order\NewOrderCreatorMail;
use App\Mail\Order\NewOrderPilotMail;
use App\Mail\Order\NewOrderClientMail;

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
        Mail::to($event->creator["email"])->send(new NewOrderCreatorMail($event->initial_date, $event->final_date, $event->creator, $event->pilot, $event->client, $event->observation));
        Mail::to($event->pilot["email"])->send(new NewOrderPilotMail($event->initial_date, $event->final_date, $event->creator, $event->pilot, $event->client, $event->observation));
        Mail::to($event->client["email"])->send(new NewOrderClientMail($event->initial_date, $event->final_date, $event->creator, $event->pilot, $event->client, $event->observation));
    }
}
