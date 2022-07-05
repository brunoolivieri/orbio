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

        $equipment_id_parameter = $this->route("equipments_module_equipment");

        return [
            'name' => 'bail|required|unique:drones,name,'.$equipment_id_parameter,
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
        return [
            'name.required' => 'O nome do equipamento deve ser informado',
            'name.unique' => 'Já existe um equipamento com esse nome',
            'manufacturer.required' => 'O fabricante do equipamento deve ser informado',
            'model.required' => 'O modelo do equipamento deve ser informado',
            'record_number.required' => 'O número do registro deve ser informado',
            'serial_number.required' => 'O número do serial deve ser informado',
            'weight.required' => 'O peso do equipamento deve ser informado',
            'purchase_date.required' => 'A data da compra deve ser informada',
            'purchase_date.date' => 'Informe uma data válida',
            'observation.required' => 'Uma observação é necessária'
        ];
    }
}
