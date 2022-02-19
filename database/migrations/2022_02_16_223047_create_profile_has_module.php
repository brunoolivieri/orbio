<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfileHasModule extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profile_has_module', function (Blueprint $table) {
            $table->unsignedBigInteger("id_modulo");
            $table->unsignedBigInteger("id_perfil");
            $table->boolean("ler");
            $table->boolean("escrever");
            $table->foreign('id_modulo')->references('id')->on('module');
            $table->foreign('id_perfil')->references('id')->on('profile')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profile_has_module');
    }
}
