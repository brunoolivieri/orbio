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
            ["id_relatorio" => 1, "id_incidente" => null, "arquivo" => "16546546.txt", "descricao" => "nenhuma", "status" => true]
        ];

        DB::table("flight_plans")->insert($records);

    }
}
