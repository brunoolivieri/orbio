<?php

/*

- Rotina para criar um Super Admin
- Executando o comando para executar o seeder, o usuário Super Admin é criado

*/

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

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
            "email" => strtolower(env("APP_NAME"))."@gmail.com",
            "senha" => password_hash(env("SUPER_ADMIN_PASS"), PASSWORD_DEFAULT),
            "status" => true,
            "id_perfil" => 1,
            "dh_criacao" => date("Y-m-d H:i:s"),
            "dh_ultimo_acesso" => date("Y-m-d H:i:s"),
        ]);

    }
}