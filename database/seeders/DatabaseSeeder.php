<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ModulesSeeder::class); // Geração dos módulos 
        $this->call(ProfilesSeeder::class); // Geração dos perfis 
        $this->call(ProfilesModulesRelationshipSeeder::class); // Geração da relação Perfis-Módulos 
        $this->call(SuperAdminSeeder::class); // Geração do Super-Admin 
        //$this->call(UsersSeeder::class); // Geração de usuários a partir do UserFactory
        $this->call(ReportsSeeder::class); // Geração dos relatórios
        $this->call(IncidentsSeeder::class); // Geração dos Incidentes
        $this->call(FlightPlansSeeder::class); // Geração dos planos de voo
        $this->call(ServiceOrdersSeeder::class); // Geração das ordens de serviço
        $this->call(OrdersUsersRelationshipSeeder::class); // Geração da relação dos usuários com as ordens de serviço

    }
}
