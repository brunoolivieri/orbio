<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EquipmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $records = [
            [
                "image" => "src path", 
                "name" => "Drone Daora", 
                "manufacturer" => "NASA", 
                "model" => "Modelo Daora", 
                "record_number" => "452",
                "serial_number" => "A789",
                "weight" => 15,
                "observation" => "nenhuma",
                "purchase_date" => date("Y-m-d H:i:s")
            ]
        ];

        DB::table("equipments")->insert($records);
    }
}
