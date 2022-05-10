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
            $table->foreignId('id_modulo')->constrained('module');
            $table->foreignId('id_perfil')->constrained('profile')->onDelete('cascade');
            $table->boolean("ler");
            $table->boolean("escrever");
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
        Schema::dropIfExists('profile_has_module');
    }
}
