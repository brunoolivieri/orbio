<?php

namespace App\Http\Requests\UserAccount;

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
            "actual_password" => ["required", "current_password"],
            "new_password" => ["required", "confirmed"]
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
            "actual_password.required" => "A senha atual precisa ser informada",
            "actual_password.current_password" => "Senha incorreta",
            "new_password.required" => "A nova senha precisa ser informada",
            "new_password.confirmed" => "A nova senha precisa ser confirmada"
        ];
    }
}
