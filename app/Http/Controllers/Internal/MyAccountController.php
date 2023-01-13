<?php

namespace App\Http\Controllers\Internal;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\{
    Users\User,
    PersonalDocuments\PersonalDocument,
    Addresses\Address
};
use App\Http\Requests\UserAccount\{
    UpdateBasicDataRequest,
    UpdateDocumentsRequest,
    UpdateAddressRequest,
    UpdatePasswordRequest
};
use App\Notifications\Account\{
    BasicDataUpdatedNotification,
    DocumentsUpdatedNotification,
    AddressUpdatedNotification
};
use App\Notifications\{
    Auth\ChangePasswordNotification,
    Modules\Administration\User\UserDisabledNotification
};

class MyAccountController extends Controller
{
    public function __construct(User $userModel, PersonalDocument $personalDocumentModel, Address $userAddressModel)
    {
        $this->userModel = $userModel;
        $this->personalDocumentModel = $personalDocumentModel;
        $this->userAddressModel = $userAddressModel;
    }

    function loadBasicData(): \Illuminate\Http\Response
    {
        $user = $this->userModel->findOrFail(Auth::user()->id);

        return response([
            "name" => $user->name,
            "email" => $user->email,
            "profile" => $user->profile->name,
            "last_access" => $user->last_access,
            "last_update" => $user->updated_at
        ], 200);
    }

    function loadComplementaryData(): \Illuminate\Http\Response
    {

        $user = $this->userModel->findOrFail(Auth::user()->id);

        $available_data = json_decode($user->profile->access_data);

        $data = [];

        // dd($available_data->address);

        foreach ($available_data as $key => $item) {

            if ($key === "address") {

                if (boolval($item)) {

                    $data["address"] = [
                        'address' => $user->personal_document->address->address,
                        'number' => $user->personal_document->address->number,
                        'cep' => $user->personal_document->address->cep,
                        'city' => isset($user->personal_document->address->city) ? $user->personal_document->address->city : "0",
                        'state' => isset($user->personal_document->address->state) ? $user->personal_document->address->state : "0",
                        'complement' => $user->personal_document->address->complement
                    ];
                } else {

                    $data["address"] = [];
                }
            } else {

                if (boolval($item)) {
                    $data["documents"][$key] = is_null($user->personal_document->$key) ? "" : $user->personal_document->$key;
                }
            }
        }

        return response($data, 200);
    }

    function basicDataUpdate(UpdateBasicDataRequest $request): \Illuminate\Http\Response
    {
        $user = $this->userModel->findOrFail(Auth::user()->id);

        $user->update($request->validated());

        $user->notify(new BasicDataUpdatedNotification($user));

        return response(["message" => "Dados básicos atualizados com sucesso!"], 200);
    }

    function documentsUpdate(UpdateDocumentsRequest $request): \Illuminate\Http\Response
    {
        $user = $this->userModel->find(Auth::user()->id);

        $this->personalDocumentModel->where("id", $user->personal_document->id)->update($request->validated());

        $user->notify(new DocumentsUpdatedNotification($user));

        return response(["message" => "Dados documentais atualizados com sucesso!"], 200);
    }

    function addressUpdate(UpdateAddressRequest $request): \Illuminate\Http\Response
    {
        $user = $this->userModel->find(Auth::user()->id);

        $this->userAddressModel->where("id", $user->personal_document->address->id)->update($request->validated());

        $user->notify(new AddressUpdatedNotification($user));

        return response(["message" => "Dados de endereço atualizados com sucesso!"], 200);
    }

    function passwordUpdate(UpdatePasswordRequest $request)
    {
        $user = $this->userModel->find(Auth::user()->id);

        $user->update([
            "password" => Hash::make($request->safe()->only(['new_password']))
        ]);

        $user->notify(new ChangePasswordNotification($user));

        return response(["message" => "Senha atualizada com sucesso!"], 200);
    }

    function accountDesactivation($id): \Illuminate\Http\Response
    {
        $user = $this->userModel->find($id);

        $user->delete();

        $user->notify(new UserDisabledNotification($user));

        return response(["message" => "Conta desativada com sucesso!"], 200);
    }
}
