<?php

/*

- Rotina para criar criar as relações entre os perfis de usuário e os módulos
- Executando o comando para executar o seeder, serão criados os registros de cada array

*/

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class ProfilesModulesRelationshipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        /*

        - Módulo 1: Administração
        - Módulo 2: Planos de voo
        - Módulo 3: Ordens de serviço
        - Módulo 4: Relatórios pós-voo
        - Módulo 5: Incidentes

        */

        $superAdminModulesRelationship = [
            ["id_modulo" => 1, "id_perfil" => 1, "ler" => true, "escrever" => true],
            ["id_modulo" => 2, "id_perfil" => 1, "ler" => true, "escrever" => true],
            ["id_modulo" => 3, "id_perfil" => 1, "ler" => true, "escrever" => true],
            ["id_modulo" => 4, "id_perfil" => 1, "ler" => true, "escrever" => true],
            ["id_modulo" => 5, "id_perfil" => 1, "ler" => true, "escrever" => true]  
        ];

        DB::table("profile_has_module")->insert($superAdminModulesRelationship);

        $subAdminModulesRelationship = [
            ["id_modulo" => 1, "id_perfil" => 2, "ler" => true, "escrever" => true],
            ["id_modulo" => 2, "id_perfil" => 2, "ler" => true, "escrever" => true],
            ["id_modulo" => 3, "id_perfil" => 2, "ler" => true, "escrever" => true],
            ["id_modulo" => 4, "id_perfil" => 2, "ler" => true, "escrever" => true],
            ["id_modulo" => 5, "id_perfil" => 2, "ler" => true, "escrever" => true]    
        ];

        DB::table("profile_has_module")->insert($subAdminModulesRelationship);

        $pilotModulesRelationship = [
            ["id_modulo" => 1, "id_perfil" => 3, "ler" => false, "escrever" => false],
            ["id_modulo" => 2, "id_perfil" => 3, "ler" => true, "escrever" => false],
            ["id_modulo" => 3, "id_perfil" => 3, "ler" => false, "escrever" => false],
            ["id_modulo" => 4, "id_perfil" => 3, "ler" => false, "escrever" => false],
            ["id_modulo" => 5, "id_perfil" => 3, "ler" => true, "escrever" => true]   
        ];

        DB::table("profile_has_module")->insert($pilotModulesRelationship);

        $clientModulesRelationship = [
            ["id_modulo" => 1, "id_perfil" => 4, "ler" => false, "escrever" => false],
            ["id_modulo" => 2, "id_perfil" => 4, "ler" => false, "escrever" => false],
            ["id_modulo" => 3, "id_perfil" => 4, "ler" => false, "escrever" => false],
            ["id_modulo" => 4, "id_perfil" => 4, "ler" => true, "escrever" => false],
            ["id_modulo" => 5, "id_perfil" => 4, "ler" => false, "escrever" => false]  
        ];

        DB::table("profile_has_module")->insert($clientModulesRelationship);



    }
}
