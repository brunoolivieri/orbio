<?php

namespace App\Services\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
// Custom
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;
use App\Models\User\UserModel;
use App\Events\Auth\LoginEvent;
use App\Notifications\Auth\LoginNotification;


class LoginService {

    private UserModel $user_model;

    /**
     * Dependency injection.
     * 
     * @param App\Models\User\UserModel $user
     */
    public function __construct(UserModel $user){
        $this->user_model = $user;
    }

    /**
     * Method for login processing
     * 
     * @param Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request) {

        if($user = Auth::attempt($request->only(["email", "password"]))){

            $user = UserModel::find(Auth::user()->id);

            // User account is active
            if(Auth::user()->status && !is_null(Auth::user()->last_access)){

                $user->update(["last_access" => date('d-m-y h:i:s')]);

                $user->notify(new LoginNotification($user));

                return response(["message" => "Acesso autorizado!"], 200);
            
            // User account is inactive
            }else if(!Auth::user()->status && is_null(Auth::user()->last_access)){

                $this->activateAccount();

                $user->update(["last_access" => date('d-m-y h:i:s')]);

                $user->notify(new LoginNotification($user));

                return response(["message" => "Ativação e acesso realizados!"], 200);

            // User account is disabled or deleted
            }else if((!Auth::user()->status && !is_null(Auth::user()->last_access) || !is_null(Auth::user()->deleted_at))){

                return response(["message" => "Conta desabilitada!"], 500);

            }

        }else{

            return response(["message" => "Credenciais inválidas!"], 500);

        }

    }

    /**
     * Method for activate user account
     * 
     * @return bool
     */
    private function activateAccount() { 

        DB::transaction(function () {
            
            UserModel::where("id", Auth::user()->id)->update(["status" => 1]);

            $new_address = UserAddressModel::create([
                "address" => null,
                "number" => null,
                "cep" => null,
                "city" => null,
                "state" => null,
                "complement" => null
            ]);
    
            $new_comp_data = UserComplementaryDataModel::create([
                "anac_license" => null,
                    "cpf" => null,
                    "cnpj" => null,
                    "telephone" => null,
                    "cellphone" => null,
                    "company_name" => null,
                    "trading_name" => null,
                    "address_id" => $new_address->id
            ]);
    
            UserModel::where('id', Auth::user()->id)->update(["complementary_data_id" => $new_comp_data->id]);

        });

    }

}