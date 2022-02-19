<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserAddressModel extends Model
{
    use HasFactory;

    protected $table = "address";
    public $timestamps = false;

     /**
     * Método para realizar um UPDATE em um registro dessa tabela
     *
     * @param int $record_id
     * @return array 
     */
    function updateUserAddress(int $record_id, array $data) : array {

        try{

            // Inicialização da transação
            DB::beginTransaction();

            UserAddressModel::where('id', $record_id)->update($data);

            // Se a operação for bem sucedida, confirmar
            DB::commit();

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            echo $e;

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            return ["status" => false, "error" => true];

        }

    }

}
