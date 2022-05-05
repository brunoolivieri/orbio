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
            "flight_initial_date" => 'required|date',
            "flight_final_date" => 'required|date',
            "observation" => 'required|string',
            "flight_log_file" => 'required|file|mimes:txt'
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
            "flight_initial_date.required" => "A data inicial deve ser definida",
            "flight_initial_date.date" => "A data inicial deve ser uma data válida",
            "flight_final_date.required" => "A data final deve ser definida",
            "flight_final_date.date" => "A data final deve ser uma data válida",
            "observation.required" => "A observação deve ser informada",
            "flight_log_file.required" => "O arquivo de log pós vôo deve ser enviado",
            "flight_log_file.file" => "Os dados pós vôo devem ser enviados em um arquivo",
            "flight_log_file.mimes" => "O arquivo de log pós vôo deve ter a extensão .txt"
        ];
    }
}
