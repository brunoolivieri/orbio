<?php

namespace App\Observers;

use App\Models\Users\User;
use App\Notifications\Modules\Administration\User\UserCreatedNotification;
use App\Notifications\Modules\Administration\User\UserUpdatedNotification;
use App\Notifications\Modules\Administration\User\UserDisabledNotification;
use App\Notifications\Modules\User\UserRestoredNotification;

class UserObserver
{

    public function created(User $user)
    {
        //
    }

    public function updated(User $user)
    {
        $user->notify(new UserUpdatedNotification());
    }

    public function deleted(User $user)
    {
        $user->notify(new UserDisabledNotification());
    }

    public function restored(User $user)
    {
        $user->notify(new UserRestoredNotification());
    }

    public function forceDeleted(User $user)
    {
        //
    }
}
