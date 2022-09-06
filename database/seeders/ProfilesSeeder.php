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
            ["name" => "Super-Admin"],
            ["name" => "Sub-Admin"],
            ["name" => "Piloto"],
            ["name" => "Cliente"],
            ["name" => "Visitante"]
        ];


        Profile::insert($data);
    }
}
