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
    public function login($request) {

        if($user = Auth::attempt($request->only(["email", "password"]))){

            // User account is active
            if(Auth::user()->status && !empty(Auth::user()->last_access)){

                $data_for_email = [
                    "id" => Auth::user()->id, 
                    "name" => Auth::user()->name, 
                    "email" => Auth::user()->email, 
                    "profile" => Auth::user()->profile->name
                ];

                event(new LoginEvent($data_for_email));

                return response(["message" => "Acesso autorizado!"], 200);
            
            // User account is inactive
            }else if(!Auth::user()->status && empty(Auth::user()->last_access)){

                $this->activateAccount();

                $data_for_email = [
                    "id" => Auth::user()->id, 
                    "name" => Auth::user()->name, 
                    "email" => Auth::user()->email, 
                    "profile" => Auth::user()->profile->name
                ];

                event(new LoginEvent($data_for_email));

                return response(["message" => "Acesso autorizado!"], 200);

            // User account is disabled or deleted
            }else if((!Auth::user()->status && !empty(Auth::user()->last_access) || (!empty(Auth::user()->deleted_at)))){

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

        try{

            DB::beginTransaction();

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
                    "CPF" => null,
                    "CNPJ" => null,
                    "telephone" => null,
                    "cellphone" => null,
                    "company_name" => null,
                    "trading_name" => null,
                    "address_id" => $new_address->id
            ]);
    
            UserModel::where('id', Auth::user()->id)->update(["complementary_data_id" => $new_comp_data->id]);
    
            DB::commit();

        }catch(\Exception $e){

            DB::rollBack();

        }

    }

}