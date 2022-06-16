<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserComplementaryDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table("user_complementary_data")->insert([
            "id_endereco" => 1,
            "habANAC" => "hab123",
            "CPF" => "04049141019",
            "CNPJ" => "87.853.209/0001-86",
            "telefone" => "991082653",
            "celular" => "991082653",
            "razaoSocial" => "teste",
            "nomeFantasia" => "Cuca Beludo"
        ]);
    }
}
