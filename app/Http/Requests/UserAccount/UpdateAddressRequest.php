<?php

namespace App\Http\Requests\UserAccount;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
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
            "address" => ["required"],
            "number" => ["required"],
            "cep" => ["required"],
            "city" => ["required"],
            "state" => ["required"],
            "complement" => ["required"]
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
            "address.required" => ["required"],
            "number.required" => ["required"],
            "cep.required" => ["required"],
            "city.required" => ["required"],
            "state.required" => ["required"],
            "complement.required" => ["required"]
        ];
    }
}
