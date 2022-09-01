<?php

namespace App\Listeners\Auth\Login;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Carbon;
// Custom
use App\Models\User\UserModel;
use App\Models\Accesses\AnnualAccessesModel;
use App\Models\Accesses\AccessedDevicesModel;
use App\Notifications\Auth\LoginNotification;

class LoginSuccessfulListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(UserModel $userModel, AnnualAccessesModel $annualAccessesModel, AccessedDevicesModel $accessedDevicesModel)
    {
        $this->userModel = $userModel;
        $this->annualAccessesModel = $annualAccessesModel;
        $this->accessedDevicesModel = $accessedDevicesModel;
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {

        // Get actual date, month and device used
        $date = Carbon::now();
        $month_column = strtolower($date->format('F'));
        $device_column = "personal_computer";

        $user = $this->userModel->find($event->user->id);
        $user->last_access = $date;
        $user->save();

        $user_annual_accesses = $this->annualAccessesModel->where("user_id", $user->id)->first();
        $user_annual_accesses->$month_column += 1;
        $user_annual_accesses->save();

        $user_devices_accessed = $this->accessedDevicesModel->where("user_id", $user->id)->first();
        $user_devices_accessed->$device_column += 1;
        $user_devices_accessed->save();

        $user->notify(new LoginNotification($user));
    }
}
