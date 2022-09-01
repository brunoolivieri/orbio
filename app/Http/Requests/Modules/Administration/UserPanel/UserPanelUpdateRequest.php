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

        $user_id_parameter = $this->route("admin_module_user");

        return [
            'name' => 'bail|required|string',
            'email' => 'bail|required|email|unique:users,email,'.$user_id_parameter,
            'profile_id' => 'bail|required|integer|numeric'
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
            'name.required' => 'O nome deve ser informado',
            'email.required' => 'O email deve ser informado',
            'email.unique' => 'Esse email já está cadastrado',
            'email.email' => 'Digite um email válido',
            'profile_id.required' => 'Um perfil deve ser selecionado'
        ];
    }

}
