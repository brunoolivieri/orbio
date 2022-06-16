<?php

namespace App\Http\Requests\Modules\Administration\ProfilePanel;

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

        $profile_id_parameter = $this->route("admin_module_profile");

        return [
            'profile_name' => 'bail|required|string|unique:profiles,nome,'.$profile_id_parameter
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
            'profile_name.required' => 'O nome do perfil deve ser informado',
            'profile_name.string' => 'O nome do perfil deve ser textual',
            'profile_name.unique' => 'Já existe um perfil com esse nome'
        ];
    }

}
