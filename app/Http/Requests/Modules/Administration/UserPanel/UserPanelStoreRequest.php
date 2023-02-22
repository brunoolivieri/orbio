<?php

namespace App\Http\Requests\Modules\Administration\UserPanel;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class UserPanelStoreRequest extends FormRequest
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
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'profile_id' => 'required|exists:profiles,id'
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
            'profile_id.required' => 'Selecione um perfil',
            'profile_id.exists' => 'Selecione um perfil válido'
        ];
    }
}
