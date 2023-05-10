<?php

namespace App\Http\Requests\v1\Authentication;

use Illuminate\Foundation\Http\FormRequest;

class PasswordResetTokenRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => 'required|email'
        ];
    }

    public function messages()
    {
        return [
            "email.required" => "O email precisa ser informado",
            "email.email" => "Informe um email válido"
        ];
    }
}
