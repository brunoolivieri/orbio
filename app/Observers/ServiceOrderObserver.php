<?php

namespace App\Observers;

use App\Models\Orders\ServiceOrderModel;
use Illuminate\Support\Facades\Auth;
use App\Notifications\Modules\ServiceOrder\ServiceOrderCreatedNotification;
use App\Notifications\Modules\ServiceOrder\ServiceOrderUpdatedNotification;
use App\Notifications\Modules\ServiceOrder\ServiceOrderDeletedNotification;

class ServiceOrderObserver
{

    /**
     * Handle the ServiceOrderModel "creating" event.
     *
     * @param  \App\Models\Order\ServiceOrderModel  $serviceOrderModel
     * @return void
     */
    public function creating(ServiceOrderModel $serviceOrderModel)
    {
        $serviceOrderModel->id = Auth::user()->id;
    }

    /**
     * Handle the ServiceOrderModel "created" event.
     *
     * @param  \App\Models\Order\ServiceOrderModel  $serviceOrderModel
     * @return void
     */
    public function created(ServiceOrderModel $serviceOrderModel)
    {
        $creator = Auth::user();
        $pilot = $serviceOrderModel->has_users->has_pilot;
        $client = $serviceOrderModel->has_users->has_client;

        $creator->notify(new ServiceOrderCreatedNotification($creator, $serviceOrderModel));
        $pilot->notify(new ServiceOrderCreatedNotification($pilot, $serviceOrderModel));
        $client->notify(new ServiceOrderCreatedNotification($client, $serviceOrderModel));
    }

    /**
     * Handle the ServiceOrderModel "updated" event.
     *
     * @param  \App\Models\Order\ServiceOrderModel  $serviceOrderModel
     * @return void
     */
    public function updated(ServiceOrderModel $serviceOrderModel)
    {
        $creator = $serviceOrderModel->has_users->has_creator;
        $pilot = $serviceOrderModel->has_users->has_pilot;
        $client = $serviceOrderModel->has_users->has_client;

        $creator->notify(new ServiceOrderUpdatedNotification($creator, $serviceOrderModel));
        $pilot->notify(new ServiceOrderUpdatedNotification($pilot, $serviceOrderModel));
        $client->notify(new ServiceOrderUpdatedNotification($client, $serviceOrderModel));
    }

    /**
     * Handle the ServiceOrderModel "deleted" event.
     *
     * @param  \App\Models\Order\ServiceOrderModel  $serviceOrderModel
     * @return void
     */
    public function deleted(ServiceOrderModel $serviceOrderModel)
    {
        $creator = $serviceOrderModel->has_users->has_creator;
        $pilot = $serviceOrderModel->has_users->has_pilot;
        $client = $serviceOrderModel->has_users->has_client;

        $creator->notify(new ServiceOrderDeletedNotification($creator, $serviceOrderModel));
        $pilot->notify(new ServiceOrderDeletedNotification($pilot, $serviceOrderModel));
        $client->notify(new ServiceOrderDeletedNotification($client, $serviceOrderModel));
    }

    /**
     * Handle the ServiceOrderModel "restored" event.
     *
     * @param  \App\Models\Order\ServiceOrderModel  $serviceOrderModel
     * @return void
     */
    public function restored(ServiceOrderModel $serviceOrderModel)
    {
        //
    }

    /**
     * Handle the ServiceOrderModel "force deleted" event.
     *
     * @param  \App\Models\Order\ServiceOrderModel  $serviceOrderModel
     * @return void
     */
    public function forceDeleted(ServiceOrderModel $serviceOrderModel)
    {
        //
    }
}
