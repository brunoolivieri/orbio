<?php

namespace App\Http\Requests\UserAccount;

use Illuminate\Foundation\Http\FormRequest;

class UpdateComplementaryDataRequest extends FormRequest
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
            "habANAC" => ["required", "unique:user_complementary_data, habANAC"],
            "cpf" => ["required", "unique:user_complementary_data, CPF"],
            "cnpj" => ["required", "unique:user_complementary_data, CNPJ"],
            "telefone" => ["required", "unique:user_complementary_data, telefone"],
            "celular" => ["required", "unique:user_complementary_data, celular"],
            "razaoSocial" => ["required", "unique:user_complementary_data, razaoSocial"],
            "nomeFantasia" => ["required", "unique:user_complementary_data, nomeFantasia"]
        ];

    }

    /**
    * Get the error messages for the defined validation rules.
    *
    * @return array
    */
    public function messages()
    {dd($request->all());
        return [
            "habANAC.required" => "A habilitação ANAC deve ser informada",
            "habANAC.unique" => "Essa habilitação já está registrada",
            "cpf.required" => "O CPF deve ser informado",
            "cpf.unique" => "Esse CPF já está registrado",
            "cpnj.required" => "O CNPJ deve ser informado",
            "cpnj.unique" => "Esse CNPJ já está registrado",
            "telefone.required" => "O número de telefone deve ser informado",
            "telefone.unique" => "Esse número de telefone já está registrado",
            "celular.required" => "O número de celular deve ser informado",
            "celular.unique" => "Esse número de celular já está registrado",
            "razaoSocial.required" => "A razão social deve ser informada",
            "razaoSocial.unique" => "Essa razão social já está registrada",
            "nomeFantasia.required" => "O nome fantasia deve ser informado",
            "nomeFantasia.unique" => "Esse nome fantasia já está registrado"
        ];
    }
}
