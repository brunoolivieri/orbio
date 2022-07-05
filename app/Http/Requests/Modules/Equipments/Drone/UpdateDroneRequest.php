<?php

namespace App\Http\Requests\Modules\Equipments\Drone;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDroneRequest extends FormRequest
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

        $drone_id_parameter = $this->route("equipments_module_drone");

        return [
            'name' => 'bail|required|unique:drones,name,'.$drone_id_parameter,
            'manufacturer' => 'bail|required',
            'model' => 'bail|required',
            'record_number' => 'bail|required',
            'serial_number' => 'bail|required',
            'weight' => 'bail|required|numeric',
            'observation' => 'bail|required'
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
            'name.required' => 'O nome do drone deve ser informado',
            'name.unique' => 'Um drone já foi cadastrado com esse nome',
            'manufacturer.required' => 'O fabricante do drone deve ser informado',
            'model.required' => 'O modelo do drone deve ser informado',
            'record_number.required' => 'O número do registro deve ser informado',
            'serial_number.required' => 'O número do serial deve ser informado',
            'weight.required' => 'O peso do drone deve ser informado',
            'observation' => 'Uma observação é necessária'
        ];
    }
}
