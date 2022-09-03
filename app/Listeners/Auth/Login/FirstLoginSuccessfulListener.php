<?php

namespace App\Listeners\Auth\Login;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
// Custom
use App\Models\User\UserModel;
use App\Models\User\AddressModel;
use App\Models\User\ComplementaryDataModel;
use App\Models\Accesses\AnnualAccessesModel;
use App\Models\Accesses\AccessedDevicesModel;

class FirstLoginSuccessfulListener
{
    /**
     * Dependency injection.
     */
    public function __construct(UserModel $userModel, AddressModel $addressModel, ComplementaryDataModel $userComplementaryDataModel,  AnnualAccessesModel $annualAcessesModel, AccessedDevicesModel $accessedDevicesModel)
    {
        $this->userModel = $userModel;
        $this->userAddressModel = $addressModel;
        $this->userComplementaryDataModel = $userComplementaryDataModel;
        $this->annualAcessesModel = $annualAcessesModel;
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
        $user = $this->userModel->find($event->user->id);

        DB::transaction(function () use ($user) {

            $user->update(["status" => 1]);

            // New Address record 
            $new_address = $this->userAddressModel->create();

            // New complementary data record
            $this->userComplementaryDataModel->create([
                "user_id" => $user->id,
                "address_id" => $new_address->id
            ]);

            // New annual access record - to count user montly accesses
            $this->annualAcessesModel->create([
                "user_id" => $user->id
            ]);

            // New device access record - to count each device access
            $this->accessedDevicesModel->create([
                "user_id" => $user->id
            ]);
        });
    }
}
