<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class UserAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table("address")->insert([
            "logradouro" => "Rua dos Bostas",
            "numero" => "123",
            "cep" => "96015160",
            "cidade" => "Pelotas",
            "estado" => "RS",
            "complemento" => "nenhum"
        ]);
    }
}
