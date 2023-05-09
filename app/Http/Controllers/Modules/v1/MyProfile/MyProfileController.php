<?php

namespace App\Http\Controllers\Modules\v1\MyProfile;

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

class MyProfileController extends Controller
{
    public function __construct(User $userModel, PersonalDocument $personalDocumentModel, Address $userAddressModel)
    {
        $this->userModel = $userModel;
        $this->personalDocumentModel = $personalDocumentModel;
        $this->userAddressModel = $userAddressModel;
    }

    function loadBasicData(): \Illuminate\Http\Response
    {
        try {

            $user = $this->userModel->findOrFail(Auth::user()->id);

            return response([
                "name" => $user->name,
                "email" => $user->email,
                "profile" => $user->profile->name,
                "last_access" => $user->last_access,
                "last_update" => $user->updated_at
            ], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }

    function loadDocuments(): \Illuminate\Http\Response
    {
        try {

            $user = $this->userModel->findOrFail(Auth::user()->id);

            $available_data = json_decode($user->profile->access_data);

            $data = [];

            foreach ($available_data as $key => $item) {
                if ($key != "address") {
                    if (boolval($item)) {
                        $data[$key] = is_null($user->personal_document->$key) ? "" : $user->personal_document->$key;
                    }
                }
            }

            return response($data, 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    function loadAddress(): \Illuminate\Http\Response
    {
        try {

            $user = $this->userModel->findOrFail(Auth::user()->id);

            $available_data = json_decode($user->profile->access_data);

            $data = [];

            foreach ($available_data as $key => $item) {
                if ($key === "address") {
                    if (boolval($item)) {
                        $data = [
                            'address' => $user->personal_document->address->address,
                            'number' => $user->personal_document->address->number,
                            'cep' => $user->personal_document->address->cep,
                            'city' => is_null($user->personal_document->address->city) ? "0" : $user->personal_document->address->city,
                            'state' => is_null($user->personal_document->address->state) ? "0" : $user->personal_document->address->state,
                            'complement' => $user->personal_document->address->complement
                        ];
                    }
                }
            }

            return response($data, 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    function basicDataUpdate(UpdateBasicDataRequest $request): \Illuminate\Http\Response
    {
        try {
            $user = $this->userModel->findOrFail(Auth::user()->id);

            $user->update($request->validated());

            $user->notify(new BasicDataUpdatedNotification($user));

            return response(["message" => "Dados básicos atualizados com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    function documentsUpdate(UpdateDocumentsRequest $request): \Illuminate\Http\Response
    {
        try {
            $user = $this->userModel->findOrFail(Auth::user()->id);

            $this->personalDocumentModel->where("id", $user->personal_document->id)->update($request->validated());

            $user->notify(new DocumentsUpdatedNotification($user));

            return response(["message" => "Dados documentais atualizados com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    function addressUpdate(UpdateAddressRequest $request): \Illuminate\Http\Response
    {

        try {
            $user = $this->userModel->findOrFail(Auth::user()->id);

            $this->userAddressModel->where("id", $user->personal_document->address->id)->update($request->validated());

            $user->notify(new AddressUpdatedNotification($user));

            return response(["message" => "Dados de endereço atualizados com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    function passwordUpdate(UpdatePasswordRequest $request, $identifier)
    {
        try {
            $user = $this->userModel->findOrFail($identifier);

            if (Hash::check($request->new_password, $user->password)) {
                throw new \Exception("Erro! A nova senha deve ser diferente da atual.", 409);
            }

            $user->update([
                "password" => Hash::make($request->new_password)
            ]);

            $user->notify(new ChangePasswordNotification($user));

            return response(["message" => "Senha atualizada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }

    function accountDeactivation($identifier): \Illuminate\Http\Response
    {
        try {
            $user = $this->userModel->findOrFail($identifier);

            $user->delete();

            $user->notify(new UserDisabledNotification($user));

            return response(["message" => "Conta desativada com sucesso!"], 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
