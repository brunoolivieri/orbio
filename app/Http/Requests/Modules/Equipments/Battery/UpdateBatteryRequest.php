<?php

namespace App\Http\Requests\Modules\Equipments\Battery;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBatteryRequest extends FormRequest
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

        $battery_id_parameter = $this->route("equipments_module_battery");

        return [
            'name' => 'required|unique:batteries,name,'.$battery_id_parameter,
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
            'name.required' => 'O nome da bateria deve ser informado',
            'name.unique' => 'Já existe uma bateria com esse nome',
            'manufacturer.required' => 'O fabricante da bateria deve ser informado',
            'model.required' => 'O modelo da bateria deve ser informado',
            'serial_number.required' => 'O número do serial deve ser informado',
            'last_charge.required' => 'A data da última carga deve ser informada',
            'last_charge.date' => 'Informe uma data válida'
        ];
    }
}
