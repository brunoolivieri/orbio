<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Model utilizado
use App\Models\User\UserModel;
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;

class CommonUserController extends Controller
{
    
    /**
     * Método para processar a requisição dos dados do usuário
     * 
     * @return \Illuminate\Http\Response
     */
    function loadUserAccountData() : \Illuminate\Http\Response {

        $user_id = request()->user_id;

        $model = new UserModel();

        $response = $model->loadAllUserData((int) $user_id);

        if($response["status"] && !$response["error"]){

            return response(["data" => $response["account_data"]], 200);

        }else if(!$response["status"] && $response["error"]){

            return response("", 200);

        }

    }

    /**
     * Método para processar a atualização dos dados do usuário
     * Utilizado no caso em que o próprio usuário atualiza o seus dados
     * 
     * @return \Illuminate\Http\Response
     */
    function userAccountDataUpdate(Request $request) : \Illuminate\Http\Response {
        
        $account_panel = request()->panel;

        if($account_panel === "basic_data"){

            if($this->userBasicDataUpdate($request)){

                return response("", 200);

            }else{

                return response("", 500);

            }

        }else if($account_panel === "complementary_data"){

            if($this->userComplementaryDataUpdate($request)){

                return response("", 200);

            }else{

                return response("", 500);

            }

        }
    }

    private function userBasicDataUpdate(Request $request) : array {

        $checkDataResponse = $this->checkIfBasicDataAlreadyExists($request);

        if($checkDataResponse["status"] && !$checkDataResponse["error"]){

            try{

                DB::beginTransaction();
    
                $old_password = UserModel::select('senha')->where('id', $request->id)->get();
    
                if(password_verify($request->actual_password, $old_password)){
    
                    $data = [
                        "nome" => $request->name,
                        "email" => $request->email,
                        "senha" => password_hash($request->new_password, PASSWORD_DEFAULT)
                    ];
    
                    $update = UserModel::where('id', $request->id)->update($data);
    
                    DB::commit();
    
                    return ["status" => true];
    
                }
    
            }catch(\Exception $e){
    
                DB::rollBack();
    
                return ["status" => false, "error" => $e->getMessage()];
    
            }

        }else if(!$checkDataResponse["status"] && $checkDataResponse["error"]){

            return $checkDataResponse;

        }


    }

    private function userComplementaryDataUpdate(Request $request) : array {

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

                return ["status" => true, "error" => false];
    
            }catch(\Exception $e){
    
                DB::rollBack();
    
                return ["status" => false, "error" => $e->getMessage()];
    
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
    function userAccountDesactivation(Request $request) : \Illuminate\Http\Response {

        


    }
    
}
