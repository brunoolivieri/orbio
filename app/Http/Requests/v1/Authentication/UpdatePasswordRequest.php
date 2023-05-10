<?php

namespace App\Http\Requests\v1\Authentication;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "password" => ["required", "confirmed"],
            "code" => ["required", "exists:password_resets,token"]
        ];
    }

    public function messages()
    {
        return [
            "password.required" => "A nova senha precisa ser informada",
            "password.confirmed" => "As senhas são incompátiveis",
            "code.required" => "O código precisa ser informado",
            "code.exists" => "Esse código não existe"
        ];
    }
}
