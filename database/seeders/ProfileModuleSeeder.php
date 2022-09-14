<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Profiles\Profile;

class ProfileModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $admin_access = [
            ["module_id" => 1, "profile_id" => 1, "read" => true, "write" => true],
            ["module_id" => 2, "profile_id" => 1, "read" => true, "write" => true],
            ["module_id" => 3, "profile_id" => 1, "read" => true, "write" => true],
            ["module_id" => 4, "profile_id" => 1, "read" => true, "write" => true],
            ["module_id" => 5, "profile_id" => 1, "read" => true, "write" => true],
            ["module_id" => 6, "profile_id" => 1, "read" => true, "write" => true]
        ];

        DB::table("profile_module")->insert($admin_access);

        $sub_admin_access = [
            ["module_id" => 1, "profile_id" => 2, "read" => true, "write" => true],
            ["module_id" => 2, "profile_id" => 2, "read" => true, "write" => true],
            ["module_id" => 3, "profile_id" => 2, "read" => true, "write" => true],
            ["module_id" => 4, "profile_id" => 2, "read" => true, "write" => true],
            ["module_id" => 5, "profile_id" => 2, "read" => true, "write" => true],
            ["module_id" => 6, "profile_id" => 2, "read" => true, "write" => true]
        ];

        DB::table("profile_module")->insert($sub_admin_access);

        $pilot_access = [
            ["module_id" => 1, "profile_id" => 3, "read" => false, "write" => false],
            ["module_id" => 2, "profile_id" => 3, "read" => true, "write" => false],
            ["module_id" => 3, "profile_id" => 3, "read" => false, "write" => false],
            ["module_id" => 4, "profile_id" => 3, "read" => false, "write" => false],
            ["module_id" => 5, "profile_id" => 3, "read" => true, "write" => true],
            ["module_id" => 6, "profile_id" => 3, "read" => true, "write" => true]
        ];

        DB::table("profile_module")->insert($pilot_access);

        $client_access = [
            ["module_id" => 1, "profile_id" => 4, "read" => false, "write" => false],
            ["module_id" => 2, "profile_id" => 4, "read" => false, "write" => false],
            ["module_id" => 3, "profile_id" => 4, "read" => false, "write" => false],
            ["module_id" => 4, "profile_id" => 4, "read" => true, "write" => false],
            ["module_id" => 5, "profile_id" => 4, "read" => false, "write" => false],
            ["module_id" => 6, "profile_id" => 4, "read" => false, "write" => false]
        ];

        DB::table("profile_module")->insert($client_access);

        $visitant_access = [
            ["module_id" => 1, "profile_id" => 5, "read" => false, "write" => false],
            ["module_id" => 2, "profile_id" => 5, "read" => false, "write" => false],
            ["module_id" => 3, "profile_id" => 5, "read" => false, "write" => false],
            ["module_id" => 4, "profile_id" => 5, "read" => false, "write" => false],
            ["module_id" => 5, "profile_id" => 5, "read" => false, "write" => false],
            ["module_id" => 6, "profile_id" => 5, "read" => false, "write" => false]
        ];

        DB::table("profile_module")->insert($visitant_access);
    }
}
