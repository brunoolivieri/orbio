<?php

namespace App\Http\Controllers\Internal;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
// Custom
use App\Models\Users\User;
use App\Models\PersonalDocuments\PersonalDocument;
use App\Models\Addresses\Address;
use App\Http\Requests\UserAccount\UpdateBasicDataRequest;
use App\Http\Requests\UserAccount\UpdateDocumentsRequest;
use App\Http\Requests\UserAccount\UpdateAddressRequest;
use App\Http\Requests\UserAccount\UpdatePasswordRequest;
use App\Notifications\Account\BasicDataUpdatedNotification;
use App\Notifications\Account\DocumentsUpdatedNotification;
use App\Notifications\Account\AddressUpdatedNotification;
use App\Notifications\Auth\ChangePasswordNotification;
use App\Notifications\Modules\Administration\User\UserDisabledNotification;

class MyAccountController extends Controller
{

    /**
     * Dependency injection.
     * 
     * @param App\Models\Users\User $userModel
     * @param App\Models\PersonalDocuments\PersonalDocument $personalDocumentModel
     * @param App\Models\Addresses\Address $userAddressModel
     */
    public function __construct(User $userModel, PersonalDocument $personalDocumentModel, Address $userAddressModel)
    {
        $this->userModel = $userModel;
        $this->personalDocumentModel = $personalDocumentModel;
        $this->userAddressModel = $userAddressModel;
    }

    /**
     * Method for load basic user account data.
     * 
     * @return \Illuminate\Http\Response
     */
    function loadBasicData(): \Illuminate\Http\Response
    {

        $user = $this->userModel->find(Auth::user()->id);

        return response([
            "name" => $user->name,
            "email" => $user->email,
            "profile" => $user->profile->name,
            "last_access" => $user->last_access,
            "last_update" => $user->updated_at
        ], 200);
    }

    /**
     * Method for load complementary user account data.
     * 
     * @return \Illuminate\Http\Response
     */
    function loadComplementaryData(): \Illuminate\Http\Response
    {

        $user = $this->userModel->find(Auth::user()->id);

        return response([
            "complementary" => [
                'anac_license' => $user->personal_document->anac_license,
                'cpf' => $user->personal_document->cpf,
                'cnpj' => $user->personal_document->cnpj,
                'telephone' => $user->personal_document->telephone,
                'cellphone' => $user->personal_document->cellphone,
                'company_name' => $user->personal_document->company_name,
                'trading_name' => $user->personal_document->trading_name
            ],
            "address" => [
                'address' => $user->personal_document->address->address,
                'number' => $user->personal_document->address->number,
                'cep' => $user->personal_document->address->cep,
                'city' => isset($user->personal_document->address->city) ? $user->personal_document->address->city : "0",
                'state' => isset($user->personal_document->address->state) ? $user->personal_document->address->state : "0",
                'complement' => $user->personal_document->address->complement
            ]
        ], 200);
    }

    /**
     * Method for load user active sessions.
     * 
     * @param  App\Http\Requests\UserAccount\UpdateBasicDataRequest  $request
     * @return \Illuminate\Http\Response
     */
    function loadActiveSessions(): \Illuminate\Http\Response
    {

        $active_sessions = [];

        for ($count = 0; $count < count(Auth::user()->sessions); $count++) {

            $user_agent_array = explode(" ", Auth::user()->sessions[$count]->user_agent);
            $browser = $user_agent_array[count($user_agent_array) - 1];

            $active_sessions[$count] = [
                "id" => Auth::user()->sessions[$count]->id,
                "user_agent" => $browser,
                "ip" => Auth::user()->sessions[$count]->ip_address,
                "last_activity" => date('d-m-Y H:i:s', strtotime(Auth::user()->sessions[$count]->last_activity))
            ];
        }

        return response($active_sessions, 200);
    }

    /**
     * Method for update user basic data.
     * 
     * @param  App\Http\Requests\UserAccount\UpdateBasicDataRequest  $request
     * @return \Illuminate\Http\Response
     */
    function basicDataUpdate(UpdateBasicDataRequest $request): \Illuminate\Http\Response
    {

        $user = $this->userModel->findOrFail(Auth::user()->id);

        $user->update($request->validated());

        $user->notify(new BasicDataUpdatedNotification($user));

        return response(["message" => "Dados básicos atualizados com sucesso!"], 200);
    }

    /**
     * Method for update user documents data.
     * 
     * @param  App\Http\Requests\UserAccount\UpdateDocumentsRequest $request
     * @return \Illuminate\Http\Response
     */
    function documentsUpdate(UpdateDocumentsRequest $request): \Illuminate\Http\Response
    {

        $user = $this->userModel->find(Auth::user()->id);

        $this->personalDocumentModel->where("id", $user->personal_document->id)->update($request->validated());

        $user->notify(new DocumentsUpdatedNotification($user));

        return response(["message" => "Dados documentais atualizados com sucesso!"], 200);
    }

    /**
     * Method for update user location data.
     * 
     * @param App\Http\Requests\UserAccount\UpdateAddressRequest $request
     * @return \Illuminate\Http\Response
     */
    function addressUpdate(UpdateAddressRequest $request): \Illuminate\Http\Response
    {

        $user = $this->userModel->find(Auth::user()->id);

        $this->userAddressModel->where("id", $user->personal_document->address->id)->update($request->validated());

        $user->notify(new AddressUpdatedNotification($user));

        return response(["message" => "Dados de endereço atualizados com sucesso!"], 200);
    }

    /**
     * Method for update user password.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    function passwordUpdate(UpdatePasswordRequest $request)
    {

        $user = $this->userModel->find(Auth::user()->id);

        $user->update($request->safe()->only(['new_password']));

        $user->notify(new ChangePasswordNotification($user));

        return response(["message" => "Senha atualizada com sucesso!"], 200);
    }

    /**
     * Method for desactivate the user account.
     * 
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    function accountDesactivation($id): \Illuminate\Http\Response
    {

        $user = $this->userModel->find($id);

        $user->delete();

        $user->notify(new UserDisabledNotification($user));

        return response(["message" => "Conta desativada com sucesso!"], 200);
    }
}
