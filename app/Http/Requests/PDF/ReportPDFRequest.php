<?php

namespace App\Http\Requests\PDF;

use Illuminate\Foundation\Http\FormRequest;

class ReportPDFRequest extends FormRequest
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
            'name' => ['required'],
            'client' => ['required', 'exists:users,name'],
            'city' => ['required'],
            'state' => ['required'],
            'farm' => ['required'],
            'area' => ['required'],
            'date' => ['required'],
            'number' => ['required'],
            'dosage' => ['required', 'numeric'],
            'temperature' => ['required', 'numeric'],
            'humidity' => ['required', 'numeric'],
            'wind' => ['required', 'numeric'],
            'provider' => ['required'],
            'responsible' => ['required']
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
            'client.required' => 'O cliente precisa ser informado',
            'client.exists' => 'Não existe cliente com esse nome',
            'state.required' => 'O estado deve ser informado',
            'city.required' => 'A cidade deve ser informada',
            'farm.required' => 'A fazenda deve ser informada',
            'area.required' => 'A area precisa ser informada',
            'date.required' => 'A data precisa ser informada',
            'number.required' => 'O número precisa ser informado',
            'dosage.required' => 'A dosagem precisa ser informada',
            'dosage.numeric' => 'A dosagem deve ser um valor numérico',
            'temperature.required' => 'A temperatura precisa ser informada',
            'temperature.numeric' => 'A temperatura deve ser um valor numérico',
            'humidity.required' => 'A umidade precisa ser informada',
            'humidity.numeric' => 'A umidade deve ser um valor numérico',
            'wind.required' => 'A velocidade do vento precisa ser informada',
            'wind.numeric' => 'A velocidade do vento deve ser um valor numérico',
            'provider.required' => 'O fornecedor precisa ser informado',
            'responsible.required' => 'O responsável precisa ser informado'
        ];
    }
}
