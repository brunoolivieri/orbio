<?php

namespace App\Http\Requests\Modules\FlightPlans;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Session;

class FlightPlanStoreRequest extends FormRequest
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
            "name" => "required|unique:flight_plans,name",
            "incident_id" => 'nullable|integer',
            "description" => 'required|string',
            "file" => 'required|file|mimes:txt,kml',
            "coordinates" => 'required'
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
            'name.required' => "O nome do plano de voo deve ser informado",
            'name.unique' => "Já existe um plano de voo com esse nome",
            'description.required' => "A descrição deve ser informada",
            'file.required' => "O plano de vôo deve ser criado",
            'file.file' => 'O plano de vôo deve ser um arquivo',
            'file.mimes' => 'O plano de vôo deve ser um arquivo com extensão .txt ou .kml',
            'coordinates.required' => "Os dados de longitude e latitude precisam ser enviados"
        ];
    }
}
