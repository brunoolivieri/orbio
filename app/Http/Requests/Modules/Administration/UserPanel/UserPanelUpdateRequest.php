<?php

namespace App\Http\Requests\Modules\Administration\UserPanel;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class UserPanelUpdateRequest extends FormRequest
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

        $user_id_parameter = $this->route("administration_user");

        return [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user_id_parameter,
            'profile_id' => 'required'
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
            'name.required' => 'Informe o nome do usuário',
            'email.required' => 'Informe o email do usuário',
            'email.unique' => 'Esse email já está cadastrado',
            'email.email' => 'Email inválido',
            'profile_id.required' => 'Selecione um perfil'
        ];
    }
}
