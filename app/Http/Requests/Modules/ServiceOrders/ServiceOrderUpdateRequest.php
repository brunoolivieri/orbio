<?php

namespace App\Http\Requests\Modules\ServiceOrders;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Session;

class ServiceOrderUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Session::get("modules_access")[3]["profile_powers"]["escrever"] == 1 ? true : false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "initial_date" => 'required|date',
            "final_date" => 'required|date',
            "numOS" => 'required|string',
            "creator_name" => 'required|string',
            "pilot_name" => 'required|string',
            "client_name" => 'required|string',
            "observation" => 'required|string',
            "status" => 'required|boolean',
            "fligth_plan_id" => 'required|integer', 
        ];
    }

    /**
    * Get the error messages for the defined validation rules.
    *
    * @return array
    */
    public function messages()
    {
        return [
            'initial_date.required' => "A data inicial deve ser informada",
            'final_date.required' => "A data final deve ser informada",
            'numOS.required' => "O numOS deve ser informado",
            'creator_name.required' => "O nome do criador deve ser informado",
            'pilot_name.required' => "O nome do piloto deve ser informado",
            'client_name.required' => "O nome do cliente deve ser informado",
            'observation.required' => "A observação deve ser informada",
            'status.required' => "O status deve ser definido",
            'status.boolean' => "O status deve ser 1 ou 0",
            'fligth_plan_id.required' => "Um plano de vôo deve ser selecionado"
        ];
    }
}
