<?php

namespace App\Events\Modules\Admin;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserCreatedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $name;
    public $email;
    public $profile;
    public $datetime;
    public $password;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(string $name, string $profile_name, string $email, string $password)
    {

        $name_parts = explode(" ", $name);
        $first_name = $name_parts[0];

        $this->name = $first_name;
        $this->email = $email;
        $this->profile = $profile_name;
        $this->datetime = date("d-m-Y H:i:s");
        $this->password = $password;
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
