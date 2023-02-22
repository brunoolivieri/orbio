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
            "password" => "required|confirmed",
            "token" => "required"
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
            "password.required" => "A nova senha precisa ser informada",
            "password.confirmed" => "As senhas são incompátiveis",
            "token.required" => "O código precisa ser informado"
        ];
    }
}
