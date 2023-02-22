<?php

namespace App\Http\Requests\Modules\Equipments\Battery;

use Illuminate\Foundation\Http\FormRequest;

class StoreBatteryRequest extends FormRequest
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
            'image' => 'required|image|mimes:png,jpg,jpeg,svg',
            'name' => 'required|unique:batteries,name',
            'manufacturer' => 'required',
            'model' => 'required',
            'serial_number' => 'required',
            'last_charge' => 'required|date'
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
            'image.required' => 'A imagem da bateria deve ser enviada',
            'image.image' => 'Formato de arquivo inválido',
            'image.mimes' => 'Deve ser uma imagem com extensão png ou jpg',
            'name.required' => 'Informe o nome da bateria',
            'name.unique' => 'Já existe uma bateria com esse nome',
            'manufacturer.required' => 'Informe o nome do fabricante da bateria',
            'model.required' => 'Informe o modelo da bateria',
            'serial_number.required' => 'Informe o número serial da bateria',
            'last_charge.required' => 'Informe a data da última carga da bateria',
            'last_charge.date' => 'Data inválida'
        ];
    }
}
