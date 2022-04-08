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
        return Session::get("modules_access")[1]["profile_powers"]["escrever"] == 1 ? true : false;
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
            'name' => 'bail|required|string|unique:profile,nome,'.$profile_id_parameter
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
            'name.required' => 'O nome do perfil deve ser informado',
            'name.string' => 'O nome do perfil deve ser textual',
            'name.unique' => 'Já existe um perfil com esse nome'
        ];
    }

}
