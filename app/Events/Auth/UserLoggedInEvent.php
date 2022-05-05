<?php

namespace App\Events\Auth;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserLoggedInEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user_id;
    public $name;
    public $email;
    public $profile;
    public $datetime;

    /**
     * Create a new event instance.
     *
     * @param $request from login request maded to LoginController
     * @return void
     */
    public function __construct(Request $request)
    {

        $name_parts = explode(" ", Auth::user()->nome);

        $this->user_id = Auth::user()->id;
        $this->name = $name_parts[0];
        $this->email = Auth::user()->email;
        $this->profile = Auth::user()->profile->nome;
        $this->datetime = date("d-m-Y H:i:s");
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