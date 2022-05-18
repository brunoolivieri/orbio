<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
// Model utilizado
use App\Models\User\UserModel;
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;
// Jobs
use App\Jobs\SendEmailJob;

class AccountSectionController extends Controller
{
    /**
     * Método para processar a requisição dos dados do usuário
     * 
     * @return \Illuminate\Http\Response
     */
    function loadUserAccountData() : \Illuminate\Http\Response {

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

    function userBasicDataUpdate(Request $request, $id) : \Illuminate\Http\Response {

        $check_data_response = $this->checkIfBasicDataAlreadyExists($request);

        if($check_data_response["status"] && !$check_data_response["error"]){

            try{

                if(isset($request->actual_password) && isset($request->new_password)){

                    $user_record = UserModel::select('senha')->where('id', $id)->get();
    
                    if(password_verify($request->actual_password, $user_record[0]->senha)){
        
                        $update = UserModel::where('id', $id)->update([
                            "nome" => $request->name,
                            "email" => $request->email,
                            "senha" => password_hash($request->new_password, PASSWORD_DEFAULT)
                        ]);
        
                        return response("", 200);
        
                    }else{

                        return response(["error" => "wrong_password"], 500);
                    }

                }else{

                    $update = UserModel::where('id', $id)->update([
                        "nome" => $request->name,
                        "email" => $request->email
                    ]);

                    return response("", 200);

                }
    
            }catch(\Exception $e){

                return response(["error" => $e->getMessage()], 200);
    
            }

        }else if(!$check_data_response["status"] && $check_data_response["error"]){

            return $check_data_response;

        }


    }

    function userComplementaryDataUpdate(Request $request, $id) : \Illuminate\Http\Response {

        $checkDataResponse = $this->checkIfComplementaryDataAlreadyExists($request);

        if($checkDataResponse["status"] && !$checkDataResponse["error"]){

            try{

                DB::beginTransaction();
    
                UserComplementaryDataModel::where('id', $request->complementary_data_id)->update(
                    [
                        "habANAC" => $request->habAnac,
                        "cpf" => $request->cpf,
                        "cnpj" => $request->cnpj,
                        "telefone" => $request->telephone,
                        "celular" => $request->cellphone,
                        "razaoSocial" => $request->rSocial,
                        "nomeFantasia" => $request->nFantasia,
                    ]
                );

                UserAddressModel::where('id', $request->address_id)->update(
                    [
                        "logradouro" => $request->logradouro,
                        "numero" => $request->address_number,
                        "cep" => $request->cep,
                        "cidade" => $request->city,
                        "estado" => $request->state,
                        "complemento" => $request->complemento
                    ]
                );

                DB::commit();

                return response("", 200);
    
            }catch(\Exception $e){
    
                DB::rollBack();

                return response(["error" => $e->getMessage()], 500);
    
            }

        }else if(!$checkDataResponse["status"] && $checkDataResponse["error"]){

            return $checkDataResponse;

        }

    }

    private function checkIfBasicDataAlreadyExists(Request $request) : array {

        $check = [];
        
        $check["email"] = UserModel::where('id', '!=', $request->id)->where('email', $request->email)->exists() ? "Esse email já existe" : false;

        if($check["email"]){

            return ["status" => false, "error" => $check];

        }else{

            return ["status" => true, "error" => false];

        }

    }

    private function checkIfComplementaryDataAlreadyExists(Request $request) : array {

        $check = [];

        $check["habAnac"] = UserComplementaryDataModel::where('id', '!=', $request->complementary_data_id)->where('habANAC', $request->habAnac)->exists() ? "Essa habilitação já existe" : false;
        $check["cpf"] = UserComplementaryDataModel::where('id', '!=', $request->complementary_data_id)->where('cpf', $request->cpf)->exists() ? "Esse CPF já existe" : false;
        $check["cnpj"] =  UserComplementaryDataModel::where('id', '!=', $request->complementary_data_id)->where('cnpj', $request->cnpj)->exists() ? "Esse CNPJ já existe" : false;
        $check["cellphone"] = UserComplementaryDataModel::where('id', '!=', $request->complementary_data_id)->where('celular', $request->cellphone)->exists() ? "Esse número de celular já existe" : false;
        $check["telephone"] = UserComplementaryDataModel::where('id', '!=', $request->complementary_data_id)->where('telefone', $request->telephone)->exists() ? "Esse número de telefone já existe" : false;
        $check["rSocial"] = UserComplementaryDataModel::where('id', '!=', $request->complementary_data_id)->where('razaoSocial', $request->rSocial)->exists() ? "Essa razão social já existe" : false;
        $check["nFantasia"] = UserComplementaryDataModel::where('id', '!=', $request->complementary_data_id)->where('nomeFantasia', $request->nFantasia)->exists() ? "Esse nome fantasia já existe" : false;

        if($check["cpf"] || $check["cnpj"] || $check["habAnac"] || $check["cellphone"] || $check["telephone"] || $check["rSocial"] || $check["nFantasia"]){

            return ["status" => false, "error" => $check];

        }else{

            return ["status" => true, "error" => false];

        }

    }

    /**
     * Método para processar a deleção da conta do usuário
     * Utilizado no caso em que o próprio usuário requisita a desativação da sua conta
     * 
     * @return \Illuminate\Http\Response
     */
    function userAccountDesactivation($user_id) : \Illuminate\Http\Response {

        try{

            $user = UserModel::find($user_id);

            $user->update(["status" => false]);

            SendEmailJob::dispatch("App\Events\User\UserAccountDesactivatedEvent", [
                "name" => $user->nome, 
                "email" => $user->email
            ]);

            return response("", 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);
        }
    }
}
