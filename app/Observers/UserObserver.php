<?php

namespace App\Observers;

use App\Models\User\UserModel;
use App\Notifications\Modules\Administration\User\UserCreatedNotification;
use App\Notifications\Modules\Administration\User\UserUpdatedNotification;
use App\Notifications\Modules\Administration\User\UserDisabledNotification;

class UserObserver
{
    /**
     * Handle the UserModel "created" event.
     *
     * @param  \App\Models\User\UserModel  $userModel
     * @return void
     */
    public function created(UserModel $userModel)
    {
        //
    }

    /**
     * Handle the UserModel "updated" event.
     *
     * @param  \App\Models\User\UserModel  $userModel
     * @return void
     */
    public function updated(UserModel $userModel)
    {
        $userModel->notify(new UserUpdatedNotification($userModel));
    }

    /**
     * Handle the UserModel "deleted" event.
     *
     * @param  \App\Models\User\UserModel  $userModel
     * @return void
     */
    public function deleted(UserModel $userModel)
    {
        $userModel->notify(new UserDisabledNotification($userModel));
    }
}
