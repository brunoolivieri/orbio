<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsers extends Migration
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
            $table->unsignedBigInteger("id_perfil");
            $table->unsignedBigInteger("id_dados_complementares")->nullable(true);
            $table->string("nome");
            $table->string("email");
            $table->string("senha");
            $table->boolean("status")->default(false);
            $table->string("token")->nullable(true);
            $table->dateTime("dh_ultimo_acesso")->nullable(true);
            $table->dateTime("dh_atualizacao")->nullable(true);
            $table->dateTime("dh_criacao")->useCurrent();
            $table->foreign('id_perfil')->references('id')->on('profile');
            $table->foreign('id_dados_complementares')->references('id')->on('user_complementary_data')->onDelete('cascade');
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
