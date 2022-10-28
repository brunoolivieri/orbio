<?php

namespace App\Http\Requests\Modules\Reports;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Session;

class ReportStoreRequest extends FormRequest
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
            'name' => ['required', 'unique:reports,name'],
            'file' => ['required']
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
            'name.required' => 'O nome do relatório precisa ser informado',
            'name.unique' => 'Já existe um relatório com esse nome',
            'file.required' => 'O arquivo do relatório precisa ser enviado'

        ];
    }
}
