<?php

namespace App\Http\Requests\v1\Modules\Equipments\Drone;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class StoreDroneRequest extends FormRequest
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
            'name' => 'required|unique:drones,name',
            'manufacturer' => 'required',
            'model' => 'required',
            'record_number' => 'required',
            'serial_number' => 'required',
            'weight' => 'required|numeric',
            'observation' => 'required'
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
            'image.required' => 'A imagem do drone deve ser enviada',
            'image.image' => 'O arquivo deve ser uma imagem',
            'image.mimes' => 'Deve ser uma imagem .png, .svg ou .jpg',
            'name.required' => 'O nome do drone deve ser informado',
            'name.unique' => 'Já existe um drone com esse nome',
            'manufacturer.required' => 'O fabricante do drone deve ser informado',
            'model.required' => 'O modelo do drone deve ser informado',
            'record_number.required' => 'O número do registro deve ser informado',
            'serial_number.required' => 'O número do serial deve ser informado',
            'weight.required' => 'O peso do drone deve ser informado'
        ];
    }
}
