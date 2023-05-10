<?php

namespace App\Http\Requests\v1\Modules\FlightPlans;

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

        $flight_plan_id_parameter = $this->route("flight_plan");

        return [
            "name" => ["sometimes", "unique:flight_plans,name,$flight_plan_id_parameter"],
            "description" => ["sometimes"],
            "undelete" => ["sometimes", "boolean"]
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
            'name.unique' => "Já existe um plano de voo com esse nome"
        ];
    }
}
