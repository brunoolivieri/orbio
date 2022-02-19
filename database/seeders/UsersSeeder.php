<?php

/*

- Rotina para criar usuários
- Executando o comando para executar o seeder, serão criados os registros do array $records

*/

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $records = [
            ["nome" => "Usuário A", "email" => "email_a@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 4],
            ["nome" => "Usuário B", "email" => "email_b@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => false, "id_perfil" => 4],
            ["nome" => "Usuário C", "email" => "email_c@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 2],
            ["nome" => "Usuário D", "email" => "email_d@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 3],
            ["nome" => "Usuário E", "email" => "email_e@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 3],
            ["nome" => "Usuário F", "email" => "email_f@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => false, "id_perfil" => 2],
            ["nome" => "Usuário G", "email" => "email_g@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 2],
            ["nome" => "Usuário H", "email" => "email_h@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 4],
            ["nome" => "Usuário I", "email" => "email_i@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 4],
            ["nome" => "Usuário J", "email" => "email_j@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 2],
            ["nome" => "Usuário L", "email" => "email_l@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 2],
            ["nome" => "Usuário M", "email" => "email_m@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 3],
            ["nome" => "Usuário N", "email" => "email_n@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 4],
            ["nome" => "Usuário O", "email" => "email_o@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 4],
            ["nome" => "Usuário P", "email" => "email_l@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 4],
            ["nome" => "Usuário Q", "email" => "email_m@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 4],
            ["nome" => "Usuário R", "email" => "email_n@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 4],
            ["nome" => "Usuário S", "email" => "email_o@gmail.com", "senha" => password_hash("123456789Aa", PASSWORD_DEFAULT), "status" => true, "id_perfil" => 4],

        ];

        DB::table("users")->insert($records);

    }
}
