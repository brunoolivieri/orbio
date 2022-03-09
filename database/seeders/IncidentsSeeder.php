<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class IncidentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        $records = [
            ["tipo_incidente" => "A1", "dh_incidente" => date("2021-02-15"), "descricao" => "Incidente Teste 1"],
            ["tipo_incidente" => "A2", "dh_incidente" => date("2019-07-22"), "descricao" => "Incidente Teste 2"]
        ];

        DB::table("incidents")->insert($records);

    }
}
