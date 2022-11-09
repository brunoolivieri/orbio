<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Profiles\Profile;

class ProfilesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ["name" => "Super-Admin", "created_at" => now(), "updated_at" => now()],
            ["name" => "Sub-Admin", "created_at" => now(), "updated_at" => now()],
            ["name" => "Piloto", "created_at" => now(), "updated_at" => now()],
            ["name" => "Cliente", "created_at" => now(), "updated_at" => now()],
            ["name" => "Visitante", "created_at" => now(), "updated_at" => now()]
        ];

        Profile::insert($data);
    }
}
