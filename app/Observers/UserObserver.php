<?php

namespace App\Observers;

// Model
use App\Models\Users\User;
use App\Notifications\Modules\Administration\User\UserUpdatedNotification;
use App\Notifications\Modules\Administration\User\UserDisabledNotification;

class UserObserver
{
    /**
     * Handle the User "created" event.
     *
     * @param  \App\Models\Users\User  $user
     * @return void
     */
    public function created(User $user)
    {
        //
    }

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

    /**
     * Handle the User "force deleted" event.
     *
     * @param  \App\Models\Users\User  $user
     * @return void
     */
    public function forceDeleted(User $user)
    {
        //
    }
}
