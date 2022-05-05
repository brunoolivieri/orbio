<?php

namespace App\Observers;

use App\Models\UserModel;

class UserModelObserver
{

    /**
     * Handle events after all transactions are committed.
     *
     * @var bool
     */
    public $afterCommit = true;

    /**
     * Handle the UserModel "created" event.
     *
     * @param  \App\Models\UserModel  $userModel
     * @return void
     */
    public function created(UserModel $userModel)
    {
        //
    }

    /**
     * Handle the UserModel "updated" event.
     *
     * @param  \App\Models\UserModel  $userModel
     * @return void
     */
    public function updated(UserModel $userModel)
    {
        //
    }

    /**
     * Handle the UserModel "deleted" event.
     *
     * @param  \App\Models\UserModel  $userModel
     * @return void
     */
    public function deleted(UserModel $userModel)
    {
        //
    }

    /**
     * Handle the UserModel "restored" event.
     *
     * @param  \App\Models\UserModel  $userModel
     * @return void
     */
    public function restored(UserModel $userModel)
    {
        //
    }

    /**
     * Handle the UserModel "force deleted" event.
     *
     * @param  \App\Models\UserModel  $userModel
     * @return void
     */
    public function forceDeleted(UserModel $userModel)
    {
        //
    }
}
