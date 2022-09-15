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
            "report_id" => 'nullable|integer|bail',
            "incident_id" => 'nullable|integer',
            "description" => 'required|string',
            "coordinates_file" => 'required|file|mimes:txt,kml'
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
            'coordinates_file.required' => "O plano de vôo deve ser criado",
            'coordinates_file.file' => 'O plano de vôo deve ser um arquivo',
            'coordinates_file.mimes' => 'O plano de vôo deve ser um arquivo com extensão .txt ou .kml'
        ];
    }
}
