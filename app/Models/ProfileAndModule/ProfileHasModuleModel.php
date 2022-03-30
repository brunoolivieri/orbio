<?php

namespace App\Models\ProfileAndModule;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\DB;

class ProfileHasModuleModel extends Model
{
    use HasFactory;

    protected $table = "profile_has_module";
    public $incrementing = false;
    public $timestamps = false;
    protected $guarded = [];

    // Método para criar um novo relacionamento perfil-módulo
    function newProfileRelationship(int $new_profile_id) : array {

        try{

            ProfileHasModuleModel::insert([
                ["id_modulo"=> 1, "id_perfil"=> $new_profile_id, "ler"=> 0, "escrever"=> 0],
                ["id_modulo"=> 2, "id_perfil"=> $new_profile_id, "ler"=> 0, "escrever"=> 0],
                ["id_modulo"=> 3, "id_perfil"=> $new_profile_id, "ler"=> 0, "escrever"=> 0],
                ["id_modulo"=> 4, "id_perfil"=> $new_profile_id, "ler"=> 0, "escrever"=> 0],
                ["id_modulo"=> 5, "id_perfil"=> $new_profile_id, "ler"=> 0, "escrever"=> 0]
            ]);

            return ["status" => true, "error" => false];
            
        }catch(\Exception $e){

            return ["status" => true, "error" => $e->getMessage()];

        }
        
    }

    function loadAllRecords($offset, $limit) : array {

        try{

            $all_records = DB::table('profile_has_module')
            ->join('profile', 'profile_has_module.id_perfil', '=', 'profile.id')
            ->select('profile_has_module.id_modulo', 'profile_has_module.id_perfil', 'profile.nome as nome_perfil', 'profile.acesso_geral', 'profile_has_module.ler', 'profile_has_module.escrever')
            ->offset($offset)->limit($limit)->get();

            $response = [
                "referencialValueForCalcPages" => ProfileHasModuleModel::all()->count() / 5,
                "selectedRecords" => $all_records
            ];

            return ["status" => true, "error" => false, "data" => $response];
                         
        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    function loadRecordThatMatchesExactlyTheParameters($profile_id, $profile_name) : array {

        try{

            $compatible_record = DB::table('profile_has_module')
            ->join('profile', 'profile_has_module.id_perfil', '=', 'profile.id')
            ->where('profile_has_module.id_perfil', '=', $profile_id)
            ->orWhere('profile.nome', '=', $profile_name)
            ->select('profile_has_module.id_modulo', 'profile_has_module.id_perfil', 'profile.nome as nome_perfil', 'profile.acesso_geral', 'profile_has_module.ler', 'profile_has_module.escrever')
            ->get();

            return ["status" => true, "error" => false, "data" => $compatible_record];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    function loadRecordCompatibleWithTheSearchedValue($value_searched, int $offset, int $limit) : array {

        try{

            $all_compatible_records = DB::table('profile_has_module')
            ->join('profile', 'profile_has_module.id_perfil', '=', 'profile.id')
            ->join('module', 'profile_has_module.id_modulo', '=', 'module.id')
            ->select('profile_has_module.id_modulo', 'profile_has_module.id_perfil', 'profile.nome as nome_perfil', 'profile.acesso_geral', 'profile_has_module.ler', 'profile_has_module.escrever')
            ->where('profile_has_module.id_perfil', 'LIKE', '%'.$value_searched.'%')
            ->orWhere('profile.nome', 'LIKE', '%'.$value_searched.'%')
            ->offset($offset)->limit($limit)->get();

            $response = [
                "referencialValueForCalcPages" => count($all_compatible_records)/5,
                "selectedRecords" => $all_compatible_records
            ];

            return ["status" => true, "error" => false, "data" => $response];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }


    }

    function updateProfileModuleRelationship(int $profile_id, $data) : array {

        try{

            DB::beginTransaction();

            for($actual_module = 1; $actual_module <= 5; $actual_module++){

                ProfileHasModuleModel::where('id_perfil', $profile_id)
                ->where('id_modulo', $actual_module)
                ->update(
                    [
                    'ler' => $data[$actual_module]["read"], 
                    'escrever' => $data[$actual_module]["write"]
                    ]
                );

            }

            DB::commit();

            return ["status" => true, "error" => false];

        }catch(\Exception $e){

            DB::rollBack();

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

}
