<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class ProfilesModulesRelationshipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $superAdminModulesRelationship = [
            ["module_id" => 1, "profile_id" => 1, "read" => true, "write" => true],
            ["module_id" => 2, "profile_id" => 1, "read" => true, "write" => true],
            ["module_id" => 3, "profile_id" => 1, "read" => true, "write" => true],
            ["module_id" => 4, "profile_id" => 1, "read" => true, "write" => true],
            ["module_id" => 5, "profile_id" => 1, "read" => true, "write" => true],
            ["module_id" => 6, "profile_id" => 1, "read" => true, "write" => true]   
        ];

        DB::table("profile_has_module")->insert($superAdminModulesRelationship);

        $subAdminModulesRelationship = [
            ["module_id" => 1, "profile_id" => 2, "read" => true, "write" => true],
            ["module_id" => 2, "profile_id" => 2, "read" => true, "write" => true],
            ["module_id" => 3, "profile_id" => 2, "read" => true, "write" => true],
            ["module_id" => 4, "profile_id" => 2, "read" => true, "write" => true],
            ["module_id" => 5, "profile_id" => 2, "read" => true, "write" => true],
            ["module_id" => 6, "profile_id" => 2, "read" => true, "write" => true]    
        ];

        DB::table("profile_has_module")->insert($subAdminModulesRelationship);

        $pilotModulesRelationship = [
            ["module_id" => 1, "profile_id" => 3, "read" => false, "write" => false],
            ["module_id" => 2, "profile_id" => 3, "read" => true, "write" => false],
            ["module_id" => 3, "profile_id" => 3, "read" => false, "write" => false],
            ["module_id" => 4, "profile_id" => 3, "read" => false, "write" => false],
            ["module_id" => 5, "profile_id" => 3, "read" => true, "write" => true],
            ["module_id" => 6, "profile_id" => 3, "read" => true, "write" => true]   
        ];

        DB::table("profile_has_module")->insert($pilotModulesRelationship);

        $clientModulesRelationship = [
            ["module_id" => 1, "profile_id" => 4, "read" => false, "write" => false],
            ["module_id" => 2, "profile_id" => 4, "read" => false, "write" => false],
            ["module_id" => 3, "profile_id" => 4, "read" => false, "write" => false],
            ["module_id" => 4, "profile_id" => 4, "read" => true, "write" => false],
            ["module_id" => 5, "profile_id" => 4, "read" => false, "write" => false],
            ["module_id" => 6, "profile_id" => 4, "read" => false, "write" => false]  
        ];

        DB::table("profile_has_module")->insert($clientModulesRelationship);

        $visitorModulesRelationship = [
            ["module_id" => 1, "profile_id" => 5, "read" => false, "write" => false],
            ["module_id" => 2, "profile_id" => 5, "read" => false, "write" => false],
            ["module_id" => 3, "profile_id" => 5, "read" => false, "write" => false],
            ["module_id" => 4, "profile_id" => 5, "read" => false, "write" => false],
            ["module_id" => 5, "profile_id" => 5, "read" => false, "write" => false],
            ["module_id" => 6, "profile_id" => 5, "read" => false, "write" => false]    
        ];

        DB::table("profile_has_module")->insert($visitorModulesRelationship);



    }
}
