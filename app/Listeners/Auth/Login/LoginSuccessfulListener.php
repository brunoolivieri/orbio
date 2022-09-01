<?php

namespace App\Listeners\Auth\Login;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Carbon;
// Custom
use App\Models\User\UserModel;
use App\Notifications\Auth\LoginNotification;

class LoginSuccessfulListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(UserModel $userModel)
    {
        $this->userModel = $userModel;
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        $user = $this->userModel->find($event->user->id);

        $user->update(["last_access" => Carbon::now()]);
        $user->refresh();
        $user->annual_accesses()->incrementMonthlyAccess();
        $user->devices_acessed()->incrementDeviceAccess();

        $user->notify(new LoginNotification($user));
    }
}
