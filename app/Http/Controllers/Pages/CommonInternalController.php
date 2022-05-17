<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
// Model da tabela de usuário
use App\Models\User\UserModel;
// Classes da lib JWT
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class CommonInternalController extends Controller
{
    /**
     * Método para retornar o layout blade.
     * 
     * @return view
     */
    function index() {

        return view("react_root"); 

    }

    /**
     * Método para processar refresh realizado dentro do sistema.
     * Qualquer requisição para uma subrota de "/sistema" redirecionar para "/sistema".
     * 
     * @return redirect
     */
    function refreshInternalSystem(){

        return redirect("/sistema");

    }

    /**
     * Método para recuperar os dados do usuário autenticado.
     * 
     * @param object Illuminate\Http\Request
     * @return \Illuminate\Http\Response
     */
    function getUserAuthenticatedData(Request $request) : \Illuminate\Http\Response {

        // If logged user is the Super Admin
        if(Auth::user()->id_perfil == 1 && Auth::user()->profile->nome == "Super-Admin"){

            $data = [
                "id" => Auth::user()->id, 
                "name"=> Auth::user()->nome,  
                "email"=> Auth::user()->email, 
                "profile_id" => Auth::user()->id_perfil,
                "profile" => Auth::user()->profile->nome,
                "complementary_data" => Auth::user()->id_dados_complementares,
                "last_access" => Auth::user()->dh_ultimo_acesso,
                "last_update" => Auth::user()->dh_atualizacao,
                "user_powers" => $this->modulesProfileRelationshipFormated()
            ];

        // If the logged user is not the Super Admin
        }else if(Auth::user()->id_perfil != 1){

            $data = array(
                "id" => Auth::user()->id, 
                "name"=> Auth::user()->nome, 
                "email"=> Auth::user()->email, 
                "profile_id" => Auth::user()->id_perfil, 
                "profile" => Auth::user()->profile->nome,
                "user_complementary_data" => array(
                    "complementary_data_id" => Auth::user()->complementary_data->id,
                    "habANAC" => Auth::user()->complementary_data->habANAC,
                    "CPF" => Auth::user()->complementary_data->CPF,
                    "CNPJ" => Auth::user()->complementary_data->CNPJ,
                    "telephone" => Auth::user()->complementary_data->telefone,
                    "cellphone" => Auth::user()->complementary_data->celular,
                    "razaoSocial" => Auth::user()->complementary_data->razaoSocial,
                    "nomeFantasia" => Auth::user()->complementary_data->nomeFantasia
                ),
                "user_address_data" => array(
                    "user_address_id" => Auth::user()->complementary_data->address->id,
                    "logradouro" => Auth::user()->complementary_data->address->logradouro,
                    "numero" => Auth::user()->complementary_data->address->numero,
                    "cep" => Auth::user()->complementary_data->address->cep,
                    "cidade" => Auth::user()->complementary_data->address->cidade,
                    "estado" => Auth::user()->complementary_data->address->estado,
                    "complemento" => Auth::user()->complementary_data->address->complemento
                ),
                "last_access" => Auth::user()->dh_ultimo_acesso,
                "last_update" => Auth::user()->dh_atualizacao,
                "user_powers" => $this->modulesProfileRelationshipFormated()
            );

        }

        return response($data, 200);

    }

    /**
    * Method to organize the data regarding the privileges of the authenticated user's profile
    * 
    */
    private function modulesProfileRelationshipFormated() : array {

        $arr_data = [];
        $row = 0;
        $current_record_data = array();

        foreach(Auth::user()->profile->module_privileges as $row => $record){

            $module_name = $record->id_modulo === 1 ? 
            "Administração" 
            : ($record->id_modulo === 2 ? "Planos" : ($record->id_modulo === 3 ? "Ordens" : ($record->id_modulo === 4 ? "Relatórios" : ($record->id_modulo === 5 ? "Incidentes" : "Equipamentos"))));

            $current_record_data[$record->id_modulo] = ["module" => $module_name, "profile_powers" => ["ler" => $record->ler, "escrever" => $record->escrever]];
       
            if($record->id_modulo === 6){

                $arr_data = $current_record_data;

            }

        }

        return $arr_data;

    }

    /**
     * Método para deslogar do sistema.
     * 
     * @return Redirect
     */
    function logout(Request $request) {

        Auth::logout();

        $request->session()->invalidate();
 
        $request->session()->regenerateToken();

        return redirect("/acessar");

    }
}
