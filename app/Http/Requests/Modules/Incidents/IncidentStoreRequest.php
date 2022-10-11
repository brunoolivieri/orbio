<?php

namespace App\Http\Requests\Modules\Incidents;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Session;

class IncidentStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "date" => "required|date",
            "type" => "required",
            "description" => "required",
            "flight_plan_id" => "required",
            "service_order_id" => "required"
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
            "date.required" => "A data do incidente deve ser definida",
            "date.date" => "Deve ser um formato de data válido",
            "type.required" => "O tipo do incidente deve ser informado",
            "description.required" => "A descrição deve ser informada",
            "flight_plan_id.required" => "Um plano de voo precisa ser selecionado",
            "service_order_id.required" => "Uma ordem de serviço precisa ser selecionada"
        ];
    }
}
