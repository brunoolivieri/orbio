<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserComplementaryDataModel extends Model
{
    use HasFactory;

    protected $table = "user_complementary_data";
    public $timestamps = false;

    /**
     * Método para realizar um UPDATE em um registro dessa tabela
     *
     * @param int $record_id
     * @return array 
     */
    function updateUserComplementaryData(int $record_id, array $data) : array {

        $check = [];

        try{

            // Inicialização da transação
            DB::beginTransaction();

            $check["habAnac"] = UserComplementaryDataModel::where('id', '!=', $record_id)->where('habANAC', $data["habANAC"])->exists() ? "Essa habilitação já existe" : false;
            $check["cpf"] = UserComplementaryDataModel::where('id', '!=', $record_id)->where('cpf', $data["cpf"])->exists() ? "Esse CPF já existe" : false;
            $check["cnpj"] =  UserComplementaryDataModel::where('id', '!=', $record_id)->where('cnpj', $data["cnpj"])->exists() ? "Esse CNPJ já existe" : false;
            $check["cellphone"] = UserComplementaryDataModel::where('id', '!=', $record_id)->where('celular', $data["celular"])->exists() ? "Esse número de celular já existe" : false;
            $check["telephone"] = UserComplementaryDataModel::where('id', '!=', $record_id)->where('telefone', $data["telefone"])->exists() ? "Esse número de telefone já existe" : false;
            $check["rSocial"] = UserComplementaryDataModel::where('id', '!=', $record_id)->where('razaoSocial', $data["razaoSocial"])->exists() ? "Essa razão social já existe" : false;
            $check["nFantasia"] = UserComplementaryDataModel::where('id', '!=', $record_id)->where('nomeFantasia', $data["nomeFantasia"])->exists() ? "Esse nome fantasia já existe" : false;

            if($check["cpf"] || $check["cnpj"] || $check["habAnac"] || $check["cellphone"] || $check["telephone"] || $check["rSocial"] || $check["nFantasia"]){

                DB::rollBack();

                return ["status" => false, "error" => $check];

            }

            UserComplementaryDataModel::where('id', $record_id)->update($data);

            // Se a operação for bem sucedida, confirmar
            DB::commit();

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => true];

        }


    }


}
