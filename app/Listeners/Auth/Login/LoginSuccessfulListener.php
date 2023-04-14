<?php

namespace App\Listeners\Auth\Login;

use Illuminate\Support\Carbon;
use App\Models\Users\User;
use App\Notifications\Auth\LoginNotification;

class LoginSuccessfulListener
{

    function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    function handle($event)
    {
        $date = Carbon::now();

        $user = $this->userModel->find($event->user->id);
        
        $user->last_access = $date;
        $user->save();

        $user->notify(new LoginNotification($user));
    }
}
