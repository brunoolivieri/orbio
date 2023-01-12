<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Profiles\Profile;

class ProfilesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ["name" => "Super-Admin", "created_at" => now(), "updated_at" => now(), "access_data" => json_encode([
                "address" => 1,
                "anac_license" => 0,
                "cpf" => 1,
                "cnpj" => 0,
                "telephone" => 0,
                "cellphone" => 1,
                "company_name" => 0,
                "trading_name" => 0
            ])],
            ["name" => "Sub-Admin", "created_at" => now(), "updated_at" => now(), "access_data" => json_encode([
                "address" => 1,
                "anac_license" => 0,
                "cpf" => 1,
                "cnpj" => 0,
                "telephone" => 0,
                "cellphone" => 1,
                "company_name" => 0,
                "trading_name" => 0
            ])],
            ["name" => "Piloto", "created_at" => now(), "updated_at" => now(), "access_data" => json_encode([
                "address" => 1,
                "anac_license" => 1,
                "cpf" => 1,
                "cnpj" => 0,
                "telephone" => 0,
                "cellphone" => 1,
                "company_name" => 0,
                "trading_name" => 0
            ])],
            ["name" => "Cliente", "created_at" => now(), "updated_at" => now(), "access_data" => json_encode([
                "address" => 1,
                "anac_license" => 0,
                "cpf" => 1,
                "cnpj" => 1,
                "telephone" => 0,
                "cellphone" => 1,
                "company_name" => 1,
                "trading_name" => 1
            ])],
            ["name" => "Visitante", "created_at" => now(), "updated_at" => now(), "access_data" => json_encode([
                "address" => 1,
                "anac_license" => 0,
                "cpf" => 1,
                "cnpj" => 0,
                "telephone" => 0,
                "cellphone" => 1,
                "company_name" => 0,
                "trading_name" => 0
            ])]
        ];

        Profile::insert($data);
    }
}
