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
            "incident_date" => "required|date",
            "incident_type" => "required",
            "description" => "required|string"
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
            "incident_date.required" => "A data do incidente deve ser definida",
            "incident_date.date" => "Deve ser um formato de data válido",
            "incident_type.required" => "O tipo do incidente deve ser informado",
            "description.required" => "A descrição deve ser informada"
        ];
    }
}
