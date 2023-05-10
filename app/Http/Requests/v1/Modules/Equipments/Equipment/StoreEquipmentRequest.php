<?php

namespace App\Http\Requests\v1\Modules\Equipments\Equipment;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipmentRequest extends FormRequest
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
            'image' => 'required|image|mimes:png,jpg,svg',
            'name' => 'required|unique:equipments,name',
            'manufacturer' => 'required',
            'model' => 'required',
            'record_number' => 'required',
            'serial_number' => 'required',
            'weight' => 'required|numeric',
            'observation' => 'required',
            'purchase_date' => 'required|date'
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
            'image.required' => 'A imagem do equipamento deve ser enviada',
            'image.image' => 'Deve ser um arquivo de imagem',
            'image.mimes' => 'Deve ser uma imagem .png, .svg ou .jpg',
            'name.required' => 'O nome do equipamento deve ser informado',
            'name.unique' => 'Já existe um equipamento com esse nome',
            'manufacturer.required' => 'O fabricante do equipamento deve ser informado',
            'model.required' => 'O modelo do equipamento deve ser informado',
            'record_number.required' => 'O número do registro deve ser informado',
            'serial_number.required' => 'O número do serial deve ser informado',
            'weight.required' => 'O peso do equipamento deve ser informado',
            'purchase_date.required' => 'A data da compra deve ser informada',
            'purchase_date.date' => 'Informe uma data válida'
        ];
    }
}
