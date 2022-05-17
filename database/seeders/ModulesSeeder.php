<?php

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
            ["nome" => "Incidentes"],
            ["nome" => "Equipamentos"]
        ];

        DB::table("module")->insert($data);

    }
}
