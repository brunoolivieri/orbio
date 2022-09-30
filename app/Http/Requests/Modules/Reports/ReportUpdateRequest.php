<?php

namespace App\Http\Requests\Modules\Reports;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Session;

class ReportUpdateRequest extends FormRequest
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
            "observation" => ['required', 'min:3', 'max:9999'],
            "flight_plan_id" => ['nullable']
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
            "observation.required" => "A descrição deve ser informada",
            "observation.min" => "A descrição deve ter pelo menos três caracteres",
            "observation.max" => "A descrição deve ter no máximo 9999 caracteres"
        ];
    }
}
