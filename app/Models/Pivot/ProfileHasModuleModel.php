<?php

namespace App\Models\Pivot;

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

    function profile(){

        $this->belongsTo("App\Models\ProfileAndModule\ProfileModel", "id_perfil");
        
    }
    
    function newProfileRelationship(int $profile_id) : array {

        try{

            ProfileHasModuleModel::insert([
                ["id_modulo"=> 1, "id_perfil"=> $profile_id, "ler"=> false, "escrever"=> false],
                ["id_modulo"=> 2, "id_perfil"=> $profile_id, "ler"=> false, "escrever"=> false],
                ["id_modulo"=> 3, "id_perfil"=> $profile_id, "ler"=> false, "escrever"=> false],
                ["id_modulo"=> 4, "id_perfil"=> $profile_id, "ler"=> false, "escrever"=> false],
                ["id_modulo"=> 5, "id_perfil"=> $profile_id, "ler"=> false, "escrever"=> false],
                ["id_modulo"=> 6, "id_perfil"=> $profile_id, "ler"=> false, "escrever"=> false]
            ]);

            return ["status" => true, "error" => false];
            
        }catch(\Exception $e){

            return ["status" => true, "error" => $e->getMessage()];

        }
        
    }

    function loadProfilesModulesRelationshipWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{

            $data = DB::table('profile_has_module')
            ->join('profiles', 'profile_has_module.id_perfil', '=', 'profiles.id')
            ->join('modules', 'profile_has_module.id_modulo', '=', 'modules.id')
            ->select('profile_has_module.id_modulo', 'modules.nome', 'profile_has_module.id_perfil', 'profiles.nome as nome_perfil', 'profile_has_module.ler', 'profile_has_module.escrever')
            ->where('profiles.deleted_at', null)
            ->when($where_value, function ($query, $where_value) {

                $query->when(is_numeric($where_value), function($query) use ($where_value){

                    $query->where('profile_has_module.id_perfil', '=', $where_value);

                }, function($query) use ($where_value){

                    $query->where('profiles.nome', 'LIKE', '%'.$where_value.'%');

                });

            })->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

            return ["status" => true, "error" => false, "data" => $data];

        }catch(\Exception $e){

            return ["status" => false, "error" => $e->getMessage()];

        }

    }

    function updateProfileModuleRelationship(int $profile_id, $data) : array {

        try{

            DB::beginTransaction();

            foreach($data as $module_id => $module_privileges){

                ProfileHasModuleModel::where('id_perfil', $profile_id)
                ->where('id_modulo', $module_id)
                ->update(
                    [
                    'ler' => $module_privileges["read"], 
                    'escrever' => $module_privileges["write"]
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
