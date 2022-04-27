<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table("users")->insert([
            "nome" => "Master",
            "email" => env("SUPER_ADMIN_EMAIL"),
            "senha" => Hash::make(env("SUPER_ADMIN_PASS")),
            "status" => true,
            "id_perfil" => 1,
            "dh_criacao" => date("Y-m-d H:i:s"),
            "dh_ultimo_acesso" => date("Y-m-d H:i:s"),
            "id_dados_complementares" => null
        ]);

    }
}