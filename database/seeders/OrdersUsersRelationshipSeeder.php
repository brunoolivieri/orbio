<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class OrdersUsersRelationshipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        $records = [
            ["id_ordem_servico" => 1, "id_usuario" => 1]
        ];

        DB::table("service_order_has_users")->insert($records);

    }
}
