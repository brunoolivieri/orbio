<?php

namespace App\Observers;

use Illuminate\Filesystem\Cache;
use Illuminate\Support\Facades\Auth;
// Model
use App\Models\ServiceOrders\ServiceOrder;
// Notification
use App\Notifications\Modules\ServiceOrder\ServiceOrderCreatedNotification;
use App\Notifications\Modules\ServiceOrder\ServiceOrderUpdatedNotification;
use App\Notifications\Modules\ServiceOrder\ServiceOrderDeletedNotification;

class ServiceOrderObserver
{

    /**
     * Handle the ServiceOrder "creating" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $service_order
     * @return void
     */
    public function creating(ServiceOrder $service_order)
    {
        $service_order->id = Auth::user()->id;
    }

    /**
     * Handle the ServiceOrder "created" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $service_order
     * @return void
     */
    public function created(ServiceOrder $service_order)
    {

        if ($service_order->users->count() > 0) {

            foreach ($service_order->users as $record) {

                if ($record->role === "pilot") {
                    $pilot = $service_order->users->pivot;
                } else if ($record->role === "client") {
                    $client = $service_order->users->pivot;
                }
            }
        }

        $creator = Auth::user();

        $creator->notify(new ServiceOrderCreatedNotification($creator, $service_order));
        $pilot->notify(new ServiceOrderCreatedNotification($pilot, $service_order));
        $client->notify(new ServiceOrderCreatedNotification($client, $service_order));
    }

    /**
     * Handle the ServiceOrder "updated" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $service_order
     * @return void
     */
    public function updated(ServiceOrder $service_order)
    {

        if ($service_order->users->count() > 0) {

            foreach ($service_order->users as $record) {

                if ($record->role === "creator") {
                    $creator = $service_order->users->pivot;
                } else if ($record->role === "pilot") {
                    $pilot = $service_order->users->pivot;
                } else if ($record->role === "client") {
                    $client = $service_order->users->pivot;
                }
            }
        }

        $creator->notify(new ServiceOrderUpdatedNotification($creator, $service_order));
        $pilot->notify(new ServiceOrderUpdatedNotification($pilot, $service_order));
        $client->notify(new ServiceOrderUpdatedNotification($client, $service_order));
    }

    /**
     * Handle the ServiceOrder "deleted" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $service_order
     * @return void
     */
    public function deleted(ServiceOrder $service_order)
    {

        if ($service_order->users->count() > 0) {

            foreach ($service_order->users as $record) {

                if ($record->role === "creator") {
                    $creator = $service_order->users->pivot;
                } else if ($record->role === "pilot") {
                    $pilot = $service_order->users->pivot;
                } else if ($record->role === "client") {
                    $client = $service_order->users->pivot;
                }
            }
        }

        $creator->notify(new ServiceOrderDeletedNotification($creator, $service_order));
        $pilot->notify(new ServiceOrderDeletedNotification($pilot, $service_order));
        $client->notify(new ServiceOrderDeletedNotification($client, $service_order));
    }

    /**
     * Handle the ServiceOrder "restored" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $service_order
     * @return void
     */
    public function restored(ServiceOrder $service_order)
    {
        //
    }
}
