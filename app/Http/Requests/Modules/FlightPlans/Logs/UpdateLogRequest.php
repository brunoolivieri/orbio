<?php

namespace App\Http\Requests\Modules\FlightPlans\Logs;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLogRequest extends FormRequest
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
        $log_id = $this->route("plans_module_log");

        return [
            "name" => ["required", "unique:logs,name,$log_id", "min:3"],
            "flight_plan_id" => ["required"],
            "service_order_id" => ["required"]
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
            'name.required' => "O nome do log deve ser informado",
            'name.unique' => "Já existe um log com esse nome",
            "name.min" => "O nome deve ter pelo menos 3 caracteres",
            "flight_plan_id.required" => "Um plano de voo deve ser vinculado",
            "service_order_id.required" => "Selecione a ordem de serviço"
        ];
    }
}
