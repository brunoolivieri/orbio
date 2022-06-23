<?php

namespace App\Http\Controllers\Internal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\FormatDataService;

class MainInternalController extends Controller
{

    private FormatDataService $format_data_service;

    public function __construct(FormatDataService $service){
        $this->format_data_service = $service;
    }

    /**
     * Método para retornar o layout blade.
     * 
     * @return view
     */
    function index() {

        return view("react_root"); 

    }

    /**
     * Method for refresh internal system.
     * Every internal reload go to /sistema.
     * 
     * @return redirect
     */
    function refreshInternalSystem(){

        return redirect("/internal");

    }

    /**
     * Método para recuperar os dados do usuário autenticado.
     * 
     * @param object Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    function getUserAuthenticatedData(Request $request) : \Illuminate\Http\Response {

        // If logged user is the Super Admin
        if(Auth::user()->profile_id == 1 && Auth::user()->profile->name == "Super-Admin"){

            $data = [
                "id" => Auth::user()->id, 
                "name"=> Auth::user()->name,  
                "email"=> Auth::user()->email, 
                "profile_id" => Auth::user()->profile_id,
                "profile" => Auth::user()->profile->name,
                "complementary_data" => Auth::user()->complementary_data_id,
                "last_access" => Auth::user()->last_access,
                "last_update" => Auth::user()->updated_at,
                "user_powers" => $this->format_data_service->modulesProfileDataFormatting(Auth::user()->profile->module_privileges)
            ];

        // If the logged user is not the Super Admin
        }else if(Auth::user()->profile_id != 1){

            $data = array(
                "id" => Auth::user()->id, 
                "name"=> Auth::user()->name, 
                "email"=> Auth::user()->email, 
                "profile_id" => Auth::user()->profile_id, 
                "profile" => Auth::user()->profile->name,
                "user_complementary_data" => array(
                    "complementary_data_id" => Auth::user()->complementary_data->id,
                    "habANAC" => Auth::user()->complementary_data->habANAC,
                    "CPF" => Auth::user()->complementary_data->CPF,
                    "CNPJ" => Auth::user()->complementary_data->CNPJ,
                    "country_code" => Auth::user()->complementary_data->country_code,
                    "area_code" => Auth::user()->complementary_data->area_code,
                    "telephone" => Auth::user()->complementary_data->telephone,
                    "cellphone" => Auth::user()->complementary_data->cellphone,
                    "company_name" => Auth::user()->complementary_data->company_name,
                    "trading_name" => Auth::user()->complementary_data->trading_name
                ),
                "user_address_data" => array(
                    "user_address_id" => Auth::user()->complementary_data->address->id,
                    "address" => Auth::user()->complementary_data->address->address,
                    "number" => Auth::user()->complementary_data->address->number,
                    "cep" => Auth::user()->complementary_data->address->cep,
                    "city" => Auth::user()->complementary_data->address->city,
                    "state" => Auth::user()->complementary_data->address->state,
                    "complement" => Auth::user()->complementary_data->address->complement
                ),
                "last_access" => Auth::user()->last_access,
                "last_update" => Auth::user()->updated_at,
                "user_powers" => $this->format_data_service->modulesProfileDataFormatting(Auth::user()->profile->module_privileges)
            );

        }

        return response($data, 200);

    }
}
