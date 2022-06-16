<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceOrdersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        $records = [
            ["id_plano_voo" => 1,"numOS" => "AABB0", "dh_atualizacao" => null, "dh_criacao" => date("Y-m-d H:i:s"), "dh_inicio" => date("2022-05-10", strtotime('+1 months')), "dh_fim" => date("Y-m-d", strtotime('+2 months')), "status" => true, "observacao" => "Nenhuma", "nome_criador" => "Usuário A", "nome_piloto" => "Usuário B", "nome_cliente" => "Umbrela_Corp"]
        ];

        DB::table("service_orders")->insert($records);

    }
}
