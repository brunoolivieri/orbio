<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BatteriesSeeder extends Seeder
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
                "name" => "Bateria Super Fuckin Charge", 
                "manufacturer" => "Polishop", 
                "model" => "Modelo Super", 
                "serial_number" => "POLI789",
                "last_charge" => date("Y-m-d H:i:s")
            ]
        ];

        DB::table("batteries")->insert($records);
    }
}
