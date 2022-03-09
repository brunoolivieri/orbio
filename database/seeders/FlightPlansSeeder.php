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
            ["id_relatorio" => 1, "id_incidente" => null, "arquivo" => "[arquivo_do_plano_de_voo]", "descricao" => "Plano de Voo 1", "status" => true],
            ["id_relatorio" => 2, "id_incidente" => 2, "arquivo" => "[arquivo_do_plano_de_voo]", "descricao" => "Plano de Voo 2", "status" => false]
        ];

        DB::table("flight_plans")->insert($records);

    }
}
