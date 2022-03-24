<?php

/*

- Rotina para criar os módulos
- Executando o comando para executar o seeder, serão criados os registros do array $data

*/

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class ModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $data = [
            ["nome" => "Administração"],
            ["nome" => "Planos de voo"],
            ["nome" => "Ordens de serviço"],
            ["nome" => "Relatórios pós-voo"],
            ["nome" => "Incidentes"]
        ];

        DB::table("module")->insert($data);

    }
}
