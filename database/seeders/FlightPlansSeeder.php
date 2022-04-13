<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class FlightPlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        $records = [
            ["id_relatorio" => 1, "id_incidente" => null, "arquivo" => "path/map_routes_log_1.txt", "descricao" => "Plano de Voo 1", "status" => true],
            ["id_relatorio" => null, "id_incidente" => 2, "arquivo" => "path/map_routes_log_2.txt", "descricao" => "Plano de Voo 2", "status" => false]
        ];

        DB::table("flight_plans")->insert($records);

    }
}
