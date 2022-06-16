<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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
            ["nome" => "Super-Admin", "dh_criacao" => date("Y-m-d H:i:s")],
            ["nome" => "Sub-Admin", "dh_criacao" => date("Y-m-d H:i:s")],
            ["nome" => "Piloto", "dh_criacao" => date("Y-m-d H:i:s")],
            ["nome" => "Cliente", "dh_criacao" => date("Y-m-d H:i:s")],
            ["nome" => "Visitante", "dh_criacao" => date("Y-m-d H:i:s")]
        ];


        DB::table("profiles")->insert($data);

    }
}
