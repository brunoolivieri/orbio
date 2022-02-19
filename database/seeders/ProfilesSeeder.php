<?php

/*

- Rotina para criar os perfis de usuário
- Executando o comando para executar o seeder, serão criados os registros do array $data

*/

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
            ["nome" => "Super-Admin", "acesso_geral" => 1, "dh_criacao" => date("Y-m-d H:i:s")],
            ["nome" => "Sub-Admin", "acesso_geral" => 2, "dh_criacao" => date("Y-m-d H:i:s")],
            ["nome" => "Piloto", "acesso_geral" => 3, "dh_criacao" => date("Y-m-d H:i:s")],
            ["nome" => "Cliente", "acesso_geral" => 4, "dh_criacao" => date("Y-m-d H:i:s")]
        ];


        DB::table("profile")->insert($data);

    }
}
