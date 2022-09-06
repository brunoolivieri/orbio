<?php

namespace App\Http\Requests\UserAccount;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateDocumentsRequest extends FormRequest
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

        $unique_id = Auth::user()->personal_document->id;

        return [
            "anac_license" => ["required", "unique:user_complementary_data,anac_license," . $unique_id],
            "cpf" => ["required", "unique:user_complementary_data,cpf," . $unique_id],
            "cnpj" => ["required", "unique:user_complementary_data,cnpj," . $unique_id],
            "telephone" => ["required", "unique:user_complementary_data,telephone," . $unique_id],
            "cellphone" => ["required", "unique:user_complementary_data,cellphone," . $unique_id],
            "company_name" => ["required", "unique:user_complementary_data,company_name," . $unique_id],
            "trading_name" => ["required", "unique:user_complementary_data,trading_name," . $unique_id]
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
            "anac_license.required" => "A habilitação ANAC deve ser informada",
            "anac_license.unique" => "Essa habilitação já está registrada",
            "cpf.required" => "O CPF deve ser informado",
            "cpf.unique" => "Esse CPF já está registrado",
            "cnpj.required" => "O CNPJ deve ser informado",
            "cnpj.unique" => "Esse CNPJ já está registrado",
            "telephone.required" => "O número de telefone deve ser informado",
            "telephone.unique" => "Esse número de telefone já está registrado",
            "cellphone.required" => "O número de celular deve ser informado",
            "cellphone.unique" => "Esse número de celular já está registrado",
            "company_name.required" => "A razão social deve ser informada",
            "company_name.unique" => "Essa razão social já está registrada",
            "trading_name.required" => "O nome fantasia deve ser informado",
            "trading_name.unique" => "Esse nome fantasia já está registrado"
        ];
    }
}
