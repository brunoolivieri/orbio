<?php

namespace App\Listeners\Auth\Login;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
// Custom
use App\Models\Users\User;
use App\Models\Addresses\Address;
use App\Models\PersonalDocuments\PersonalDocument;
use App\Models\Accesses\AnnualTraffic;
use App\Models\Accesses\AccessedDevice;

class FirstLoginSuccessfulListener
{
    /**
     * Dependency injection.
     */
    public function __construct(User $userModel, Address $addressModel, PersonalDocument $personalDocumentModel, AnnualTraffic $annualAcessesModel, AccessedDevice $accessedDevicesModel)
    {
        $this->userModel = $userModel;
        $this->userAddressModel = $addressModel;
        $this->personalDocumentModel = $personalDocumentModel;
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

            // New personal documents data record
            $this->personalDocumentModel->create([
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