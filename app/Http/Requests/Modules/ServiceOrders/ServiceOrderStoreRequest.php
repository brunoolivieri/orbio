<?php

namespace App\Http\Requests\Modules\ServiceOrders;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Session;

class ServiceOrderStoreRequest extends FormRequest
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
            "pilot_id" => 'required|string',
            "client_id" => 'required|string',
            "observation" => 'required|string',
            "status" => 'required|boolean',
            "fligth_plans_ids" => 'required|string', 
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
            'initial_date.date' => "Deve ser um formato de data válido",
            'final_date.date' => "Deve ser um formato de data válido",
            'pilot_id.required' => "O piloto deve ser selecionado",
            'client_id.required' => "O cliente deve ser selecionado",
            'observation.required' => "A observação deve ser informada",
            'status.required' => "O status deve ser definido",
            'status.boolean' => "O status deve ser 1 ou 0",
            'fligth_plans_ids.required' => "Pelo menos um plano de vôo deve ser selecionado"
        ];
    }
}
