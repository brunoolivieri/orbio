<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
// Model utilizado
use App\Models\User\UserModel;
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;
// Events
use App\Events\User\UserPasswordChangedEvent;
use App\Events\User\UserAccountDesactivatedEvent;
// Requests
use App\Http\Requests\UserAccount\UpdateBasicDataRequest;
use App\Http\Requests\UserAccount\UpdateDocumentsRequest;
use App\Http\Requests\UserAccount\UpdateAddressRequest;
use App\Http\Requests\UserAccount\UpdatePasswordRequest;

class AccountSectionController extends Controller
{
    /**
     * Method for load user account data.
     * 
     * @return \Illuminate\Http\Response
     */
    function loadAccountData() : \Illuminate\Http\Response {

        if(request()->user_id == Auth::user()->id){

            $model = new UserModel();

            $response = $model->loadAllUserData((int) Auth::user()->id);

            if($response["status"] && !$response["error"]){

                $active_sessions = [];
                for($count = 0; $count < count(Auth::user()->sessions); $count++){

                    $user_agent_array = explode(" ", Auth::user()->sessions[$count]->user_agent);
                    $browser = $user_agent_array[count($user_agent_array) - 1];

                    $active_sessions[$count] = [
                        "id" => Auth::user()->sessions[$count]->id,
                        "user_agent" => $browser,
                        "ip" => Auth::user()->sessions[$count]->ip_address,
                        "last_activity" => date('d-m-Y H:i:s', strtotime(Auth::user()->sessions[$count]->last_activity))
                    ];
                }

                $response["account_data"]["active_sessions"] = $active_sessions;

                return response([$response["account_data"]], 200);

            }else if(!$response["status"] && $response["error"]){

                return response("", 500);

            }

        }else{

            return response("", 500);
        } 

    }

    /**
     * Method for update user basic data.
     * 
     * @param  App\Http\Requests\UserAccount\UpdateBasicDataRequest  $request
     * @return \Illuminate\Http\Response
     */
    function basicDataUpdate(UpdateBasicDataRequest $request) : \Illuminate\Http\Response {

        try{

            UserModel::where("id", Auth::user()->id)->update([
                "nome" => $request->name,
                "email" => $request->email
            ]);

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 200);

        }

    }

    /**
     * Method for update user documents data.
     * 
     * @param  App\Http\Requests\UserAccount\UpdateDocumentsRequest $request
     * @return \Illuminate\Http\Response
     */
    function documentsUpdate(UpdateDocumentsRequest $request) : \Illuminate\Http\Response {

        try{

            $user = UserModel::find(Auth::user()->id);

            UserComplementaryDataModel::where("id", $user->complementary_data->id)->update([
                "habANAC" => $request->anac_license,
                "cpf" => $request->cpf,
                "cnpj" => $request->cnpj,
                "telefone" => $request->telephone,
                "celular" => $request->cellphone,
                "razaoSocial" => $request->company_name,
                "nomeFantasia" => $request->trading_name
            ]);

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);

        }

    }

    /**
     * Method for update user location data.
     * 
     * @param App\Http\Requests\UserAccount\UpdateAddressRequest $request
     * @return \Illuminate\Http\Response
     */
    function addressUpdate(UpdateAddressRequest $request) : \Illuminate\Http\Response {

        try{

            $user = UserModel::find(Auth::user()->id);

            UserAddressModel::where("id", $user->complementary_data->address->id)->update([
                "logradouro" => $request->street_name,
                "numero" => $request->number,
                "cep" => $request->cep,
                "cidade" => $request->city,
                "estado" => $request->state,
                "complemento" => $request->complement
            ]);

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);

        }

    }

    /**
     * Method for update user password.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    function passwordUpdate(UpdatePasswordRequest $request){

        try{

            $user = UserModel::find(Auth::user()->id);

            $user->update(["senha" => Hash::make($request->new_password)]);

            event(new UserPasswordChangedEvent($user));

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);

        }
    }

    /**
     * Method for desactivate the user account.
     * 
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    function accountDesactivation($id) : \Illuminate\Http\Response {

        try{

            $user = UserModel::find($id);

            $user->update(["status" => false]);

            event(new UserAccountDesactivatedEvent($user));

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);
        }
    }
}
