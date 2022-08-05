<?php

namespace App\Http\Requests\Modules\FlightPlans;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Session;

class FlightPlanUpdateRequest extends FormRequest
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

        $flight_plan_id_parameter = $this->route("plans_module");

        return [
            "name" => "required|unique:flight_plans,name,".$flight_plan_id_parameter,
            "report_id" => 'nullable|integer|bail',
            "incident_id" => 'nullable|integer',
            "status" => 'required|boolean',
            "description" => 'required|string',
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
            'status.required' => "O status deve ser definido",
            'status.boolean' => "O status deve ser 1 ou 0",
            'description.required' => "A descrição deve ser informada"
        ];
    }
}
