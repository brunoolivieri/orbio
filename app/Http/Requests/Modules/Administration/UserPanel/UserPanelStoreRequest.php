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
        return Session::get("modules_access")[1]["profile_powers"]["escrever"] == 1 ? true : false;
    }

    /**
    * Get the validation rules that apply to the request.
    *
    * @return array
    */
    public function rules()
    {
        return [
                'name' => 'bail|required|string',
                'email' => 'bail|required|email|unique:users,email,',
                'profile_id' => 'bail|required|integer|numeric',
                'password' => 'bail|required'
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
            'name.required' => 'O nome do usuário deve ser informado',
            'email.required' => 'O email do usuário deve ser informado',
            'email.unique' => 'Esse email já está cadastrado',
            'email.email' => 'Digite um email válido',
            'profile_id.required' => 'Um perfil de usuário deve ser selecionado'
        ];
    }

}
