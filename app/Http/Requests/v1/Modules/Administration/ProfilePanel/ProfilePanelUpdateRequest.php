<?php

namespace App\Http\Requests\v1\Modules\Administration\ProfilePanel;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ProfilePanelUpdateRequest extends FormRequest
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

        $profile_id_parameter = $this->route("administration_profile");

        return [
            'name' => 'required|unique:profiles,name,' . $profile_id_parameter,
            'privileges' => 'required',
            'access_data' => 'required',
            'undelete' => 'required|boolean'
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
            'name.required' => 'Informe o nome do perfil',
            'name.unique' => 'Já existe um perfil com esse nome'
        ];
    }
}