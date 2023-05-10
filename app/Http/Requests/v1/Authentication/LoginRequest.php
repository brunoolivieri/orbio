<?php

namespace App\Http\Requests\v1\Authentication;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => 'required|email',
            'password' => 'required'
        ];
    }

    public function messages()
    {
        return [
            "email.required" => "Informe o email",
            "email.email" => "Email inválido",
            "password.required" => "Informe a senha"
        ];
    }
}
