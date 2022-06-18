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

        $this->belongsTo("App\Models\Profiles\ProfileModel", "profile_id");
        
    }
    
    function newProfileRelationship(int $profile_id) : array {

        try{

            ProfileHasModuleModel::insert([
                ["module_id"=> 1, "profile_id"=> $profile_id, "read"=> false, "write"=> false],
                ["module_id"=> 2, "profile_id"=> $profile_id, "read"=> false, "write"=> false],
                ["module_id"=> 3, "profile_id"=> $profile_id, "read"=> false, "write"=> false],
                ["module_id"=> 4, "profile_id"=> $profile_id, "read"=> false, "write"=> false],
                ["module_id"=> 5, "profile_id"=> $profile_id, "read"=> false, "write"=> false],
                ["module_id"=> 6, "profile_id"=> $profile_id, "read"=> false, "write"=> false]
            ]);

            return ["status" => true, "error" => false];
            
        }catch(\Exception $e){

            return ["status" => true, "error" => $e->getMessage()];

        }
        
    }

    function loadProfilesModulesRelationshipWithPagination(int $limit, int $current_page, bool|string $where_value) : array {

        try{

            $data = DB::table('profile_has_module')
            ->join('profiles', 'profile_has_module.profile_id', '=', 'profiles.id')
            ->join('modules', 'profile_has_module.module_id', '=', 'modules.id')
            ->select('profile_has_module.module_id', 'modules.name', 'profile_has_module.profile_id', 'profiles.name as profile_name', 'profile_has_module.read', 'profile_has_module.write')
            ->where('profiles.deleted_at', null)
            ->when($where_value, function ($query, $where_value) {

                $query->when(is_numeric($where_value), function($query) use ($where_value){

                    $query->where('profile_has_module.profile_id', '=', $where_value);

                }, function($query) use ($where_value){

                    $query->where('profiles.name', 'LIKE', '%'.$where_value.'%');

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

                ProfileHasModuleModel::where('profile_id', $profile_id)
                ->where('module_id', $module_id)
                ->update(
                    [
                    'read' => $module_privileges["read"], 
                    'write' => $module_privileges["write"]
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
