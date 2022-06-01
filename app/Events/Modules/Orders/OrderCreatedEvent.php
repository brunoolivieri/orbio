<?php

namespace App\Events\Modules\Orders;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreatedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $initial_date;
    public string $final_date;
    public array $creator;
    public array $pilot;
    public string $observation;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(array $data)
    {
        $this->initial_date = $data["initial_date"];
        $this->final_date = $data["final_date"];
        $this->creator = [
            "fullname" => $data["creator"]["name"],
            "first_name" =>  explode(" ", $data["creator"]["name"])[0],
            "email" => $data["creator"]["email"]
        ];
        $this->pilot = [
            "fullname" => $data["pilot"]["name"],
            "first_name" => explode(" ", $data["pilot"]["name"])[0],
            "email" => $data["pilot"]["email"]
        ];
        $this->client = [
            "fullname" => $data["client"]["name"],
            "first_name" => explode(" ", $data["client"]["name"])[0],
            "email" => $data["client"]["email"]
        ];
        $this->observation = $data["observation"];
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
