<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_perfil')->constrained('profiles');
            $table->foreignId('id_dados_complementares')->nullable(true)->constrained('user_complementary_data')->onDelete('cascade');
            $table->string("nome");
            $table->string("email");
            $table->string("senha");
            $table->boolean("status")->default(false);
            $table->string("token")->nullable(true);
            $table->dateTime("dh_ultimo_acesso")->nullable(true);
            $table->dateTime("dh_atualizacao")->nullable(true);
            $table->dateTime("dh_criacao")->useCurrent();   
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
