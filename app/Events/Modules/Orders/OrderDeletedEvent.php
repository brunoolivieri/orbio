<?php

namespace App\Events\Modules\Orders;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
// Model
use App\Models\Orders\ServiceOrdersModel;

class OrderDeletedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ServiceOrdersModel $service_order;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(ServiceOrdersModel $service_order)
    {
        $this->service_order = $service_order;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
