<?php

namespace App\Observers;

use Illuminate\Filesystem\Cache;
// Model
use App\Models\Users\User;
// Notification
use App\Notifications\Modules\Administration\User\UserUpdatedNotification;
use App\Notifications\Modules\Administration\User\UserDisabledNotification;

class UserObserver
{

    /**
     * Handle the User "updated" event.
     *
     * @param  \App\Models\Users\User  $user
     * @return void
     */
    public function updated(User $user)
    {   
        $user->notify(new UserUpdatedNotification($user));
    }

    /**
     * Handle the User "deleted" event.
     *
     * @param  \App\Models\Users\User  $user
     * @return void
     */
    public function deleted(User $user)
    {
        $user->notify(new UserDisabledNotification($user));
    }

    /**
     * Handle the User "restored" event.
     *
     * @param  \App\Models\Users\User  $user
     * @return void
     */
    public function restored(User $user)
    {
        //
    }
}
