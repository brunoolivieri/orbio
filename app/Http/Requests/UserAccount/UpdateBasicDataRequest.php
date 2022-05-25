<?php

namespace App\Http\Requests\UserAccount;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBasicDataRequest extends FormRequest
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
            "name" => ["required"],
            "email" => ["required", "unique:users,email"]
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
            "name.required" => "O nome deve ser informado",
            "email.required" => "O email deve ser informado",
            "email.unique" => "Esse email já está cadastrado"
        ];
    }
}
