<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modules\Module;

class ModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Module::insert(
            ["name" => "Administração"],
            ["name" => "Planos de voo"],
            ["name" => "Ordens de serviço"],
            ["name" => "Relatórios pós-voo"],
            ["name" => "Incidentes"],
            ["name" => "Equipamentos"]
        );
    }
}
