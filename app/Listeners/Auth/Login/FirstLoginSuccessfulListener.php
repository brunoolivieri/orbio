<?php

namespace App\Listeners\Auth\Login;

use Illuminate\Support\Facades\DB;
use App\Models\Users\User;
use App\Models\Addresses\Address;
use App\Models\PersonalDocuments\PersonalDocument;

class FirstLoginSuccessfulListener
{

    function __construct(User $userModel, Address $addressModel, PersonalDocument $personalDocumentModel)
    {
        $this->userModel = $userModel;
        $this->userAddressModel = $addressModel;
        $this->personalDocumentModel = $personalDocumentModel;
    }

    function handle($event)
    {
        $user = $this->userModel->find($event->user->id);

        DB::transaction(function () use ($user) {
           
            $user->update(["status" => 1]);

            $user->refresh();

            // New Address record 
            $new_address = $this->userAddressModel->create();

            // New personal documents data record
            $this->personalDocumentModel->create([
                "user_id" => $user->id,
                "address_id" => $new_address->id
            ]);
        });
    }
}
