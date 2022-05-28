<?php

namespace App\Http\Requests\Modules\Equipments\Equipment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEquipmentRequest extends FormRequest
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
            'image' => 'bail|required',
            'name' => 'bail|required|unique:drones,name',
            'manufacturer' => 'bail|required',
            'model' => 'bail|required',
            'record_number' => 'bail|required',
            'serial_number' => 'bail|required',
            'weight' => 'bail|required|numeric',
            'observation' => 'bail|required',
            'purchase_date' => 'bail|required|date'
        ]; 
    }

    /**
    * Get the error messages for the defined validation rules.
    *
    * @return array
    */
    public function messages()
    {
        dd("ok");
        return [
            'image.required' => 'A imagem do drone deve ser enviada',
            'name.required' => 'O nome do drone deve ser informado',
            'name.unique' => 'Já existe um drone com esse nome',
            'manufacturer.required' => 'O fabricante do drone deve ser informado',
            'model.required' => 'O modelo do drone deve ser informado',
            'record_number.required' => 'O número do registro deve ser informado',
            'serial_number.required' => 'O número do serial deve ser informado',
            'weight.required' => 'O peso do drone deve ser informado',
            'purchase_date.required' => 'A data da última carga deve ser informada',
            'purchase_date.date' => 'Informe uma data válida'
        ];
    }
}