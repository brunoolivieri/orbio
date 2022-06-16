<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReportsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        $records = [
            ["dh_criacao" => date("Y-m-d H:i:s"), "dh_inicio_voo" => date("2022-05-10", strtotime('+1 months')), "dh_fim_voo" => date("Y-m-d", strtotime('+2 months')), "log_voo" => "path/flight_log_1.txt", "observacao" => "Relatório Teste 1"],
            ["dh_criacao" => date("Y-m-d H:i:s"), "dh_inicio_voo" => date("2022-05-10", strtotime('+3 months')), "dh_fim_voo" => date("Y-m-d", strtotime('+5 months')), "log_voo" => "path/flight_log_2.txt", "observacao" => "Relatório Teste 2"]
        ];

        DB::table("reports")->insert($records);

    }
}
