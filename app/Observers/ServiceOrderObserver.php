<?php

namespace App\Observers;

use App\Models\ServiceOrders\ServiceOrder;
use Illuminate\Support\Facades\Auth;
use App\Notifications\Modules\ServiceOrder\ServiceOrderCreatedNotification;
use App\Notifications\Modules\ServiceOrder\ServiceOrderUpdatedNotification;
use App\Notifications\Modules\ServiceOrder\ServiceOrderDeletedNotification;

class ServiceOrderObserver
{

    /**
     * Handle the ServiceOrder "creating" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $serviceOrderModel
     * @return void
     */
    public function creating(ServiceOrder $serviceOrderModel)
    {
        $serviceOrderModel->id = Auth::user()->id;
    }

    /**
     * Handle the ServiceOrder "created" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $serviceOrderModel
     * @return void
     */
    public function created(ServiceOrder $serviceOrderModel)
    {
        $creator = Auth::user();
        $pilot = $serviceOrderModel->has_users->has_pilot;
        $client = $serviceOrderModel->has_users->has_client;

        $creator->notify(new ServiceOrderCreatedNotification($creator, $serviceOrderModel));
        $pilot->notify(new ServiceOrderCreatedNotification($pilot, $serviceOrderModel));
        $client->notify(new ServiceOrderCreatedNotification($client, $serviceOrderModel));
    }

    /**
     * Handle the ServiceOrder "updated" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $serviceOrderModel
     * @return void
     */
    public function updated(ServiceOrder $serviceOrderModel)
    {
        $creator = $serviceOrderModel->has_users->has_creator;
        $pilot = $serviceOrderModel->has_users->has_pilot;
        $client = $serviceOrderModel->has_users->has_client;

        $creator->notify(new ServiceOrderUpdatedNotification($creator, $serviceOrderModel));
        $pilot->notify(new ServiceOrderUpdatedNotification($pilot, $serviceOrderModel));
        $client->notify(new ServiceOrderUpdatedNotification($client, $serviceOrderModel));
    }

    /**
     * Handle the ServiceOrder "deleted" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $serviceOrderModel
     * @return void
     */
    public function deleted(ServiceOrder $serviceOrderModel)
    {
        $creator = $serviceOrderModel->has_users->has_creator;
        $pilot = $serviceOrderModel->has_users->has_pilot;
        $client = $serviceOrderModel->has_users->has_client;

        $creator->notify(new ServiceOrderDeletedNotification($creator, $serviceOrderModel));
        $pilot->notify(new ServiceOrderDeletedNotification($pilot, $serviceOrderModel));
        $client->notify(new ServiceOrderDeletedNotification($client, $serviceOrderModel));
    }

    /**
     * Handle the ServiceOrder "restored" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $serviceOrderModel
     * @return void
     */
    public function restored(ServiceOrder $serviceOrderModel)
    {
        //
    }

    /**
     * Handle the ServiceOrder "force deleted" event.
     *
     * @param  \App\Models\Order\ServiceOrder  $serviceOrderModel
     * @return void
     */
    public function forceDeleted(ServiceOrder $serviceOrderModel)
    {
        //
    }
}
