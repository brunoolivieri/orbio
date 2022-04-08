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
        return Session::get("modules_access")[2]["profile_powers"]["escrever"] == 1 ? true : false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "report_id" => 'nullable|integer|bail',
            "incident_id" => 'nullable|integer',
            "status" => 'required|boolean',
            "description" => 'required|string',
            "flight_plan" => 'required|file|mimes:txt,kml'
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
            'status.required' => "O status deve ser definido",
            'status.boolean' => "O status deve ser 1 ou 0",
            'description.required' => "A descrição deve ser informada",
            'flight_plan.required' => "O plano de vôo deve ser criado",
            'flight_plan.file' => 'O plano de vôo deve ser um arquivo',
            'flight_plan.mimes' => 'O plano de vôo deve ser um arquivo com extensão .txt ou .kml'
        ];
    }
}
