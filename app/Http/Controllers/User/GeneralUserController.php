<?php

/*

- Operações que o próprio usuário genérico realiza
- Por exemplo, é o próprio usuário que ativa a sua conta

*/

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Model utilizado
use App\Models\User\UserModel;
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;

use Illuminate\Support\Facades\Session;

class GeneralUserController extends Controller
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
    function userUpdatesHisData(Request $request) : \Illuminate\Http\Response {
        
        $account_panel = request()->panel;

        $model = new UserModel();

        if($account_panel === "basic_data"){

            $data = [
                "nome" => $request->name,
                "email" => $request->email,
                "senha" => password_hash($request->password, PASSWORD_DEFAULT)
            ];

            $update = $model->updateUserData($request->id, $data);

            if($update["status"] && !$update["error"]){

                return response("", 200);

            }else if(!$update["status"] && $update["error"]){

                return response(["error" => $update["error"]], 500);

            }

        }else if($account_panel === "complementary_data"){

            $complementary_data_table = [
                "habANAC" => $request->habAnac,
                "cpf" => $request->cpf,
                "cnpj" => $request->cnpj,
                "telefone" => $request->telephone,
                "celular" => $request->cellphone,
                "razaoSocial" => $request->rSocial,
                "nomeFantasia" => $request->nFantasia,
            ];

            $model = new UserComplementaryDataModel();

            $update_cp = $model->updateUserComplementaryData((int) $request->complementary_data_id, $complementary_data_table);

            if($update_cp["status"] && !$update_cp["error"]){

                $address_table = [
                    "logradouro" => $request->logradouro,
                    "numero" => $request->address_number,
                    "cep" => $request->cep,
                    "cidade" => $request->city,
                    "estado" => $request->state,
                    "complemento" => $request->complemento
                ];

                $model = new UserAddressModel();

                $update_ad = $model->updateUserAddress((int) $request->address_id, $address_table);

                if($update_ad["status"] && !$update_ad["error"]){

                    return response("", 200);

                }else if(!$update_ad["status"] && $update_ad["error"]){

                    return response(["error" => $update_ad["error"]], 500);

                }

            }else if(!$update_cp["status"] && $update_cp["error"]){

                return response(["error" => $update_cp["error"]], 500);

            }
        }
    }

    /**
     * Método para processar a deleção da conta do usuário
     * Utilizado no caso em que o próprio usuário requisita a desativação da sua conta
     * 
     * @return \Illuminate\Http\Response
     */
    function userDisactivatesHisAccount(Request $request) : \Illuminate\Http\Response {



    }

}
