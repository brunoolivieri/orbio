<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(ModulesSeeder::class); 
        $this->call(ProfilesSeeder::class);
        $this->call(ProfileModuleSeeder::class); 
        $this->call(AdminSeeder::class); 
    }
}
