<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Users\User;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            "name" => "Master",
            "email" => env("ADMIN_EMAIL"),
            "password" => Hash::make(env("ADMIN_PASS")),
            "status" => true,
            "profile_id" => 1,
            "last_access" => date("Y-m-d H:i:s")
        ]);
    }
}
