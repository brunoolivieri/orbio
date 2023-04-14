<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Users\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            "name" => "Master",
            "email" => env("ADMIN_EMAIL"),
            "password" => Hash::make(env("ADMIN_PASS")),
            "status" => false,
            "profile_id" => 1
        ]);
    }
}
