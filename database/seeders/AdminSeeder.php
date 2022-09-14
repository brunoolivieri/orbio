<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Users\User;
use App\Models\Accesses\AnnualTraffic;
use App\Models\Accesses\AccessedDevice;

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
            "password" => env("ADMIN_PASS"),
            "status" => true,
            "profile_id" => 1,
            "last_access" => date("Y-m-d H:i:s")
        ]);

        AnnualTraffic::create([
            "user_id" => $user->id,
            "january" => 0,
            "february" => 0,
            "march" => 0,
            "april" => 0,
            "may" => 0,
            "june" => 0,
            "july" => 0,
            "august" => 0,
            "september" => 0,
            "october" => 0,
            "november" => 0,
            "december" => 0
        ]);

        AccessedDevice::create([
            "user_id" => $user->id,
            "personal_computer" => 0,
            "smartphone" => 1,
            "tablet" => 0,
            "other" => 0
        ]);
    }
}
