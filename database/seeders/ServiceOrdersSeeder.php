<?php


/*

- Rotina para criar orderns de serviço
- Executando o comando para executar o seeder, serão criados os registros do array $data

*/

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
        
        $data = [
            ["numOS" => "AABB10", "dh_alteracao" => NULL, "dh_inicio" => date('d-m-Y h:i'), "dh_fim" => '01-05-2022 00:00:00', "situacao" => true, "observacoes" => "Nenhuma", "nome_criador" => "Mario do Armário", "nome_piloto" => "Leticia Silva", "nome_cliente" => "Umbrela_Corp"]
        ];


        DB::table("service_orders")->insert($data);

    }
}
