<?php

namespace App\Http\Requests\Auth\ForgotPassword;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
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
            "new_password" => "required|confirmed|min:3|max:15",
            "token" => "required|string"
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
            "new_password.required" => "A nova senha precisa ser informada",
            "new_password.confirmed" => "As senhas são incompátiveis",
            "new_password.min" => "A senha deve ter no mínimo 3 caracteres",
            "new_password.max" => "A senha deve ter no máximo 15 caracteres",
            "token.required" => "O código precisa ser informado",
            "token.string" => "Código inválido"
        ];
    }
}
