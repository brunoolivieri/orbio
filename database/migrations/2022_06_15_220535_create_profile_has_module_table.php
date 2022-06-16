<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfileHasModuleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profile_has_module', function (Blueprint $table) {
            $table->foreignId('id_modulo')->constrained('modules');
            $table->foreignId('id_perfil')->constrained('profiles')->onDelete('cascade');
            $table->boolean("ler");
            $table->boolean("escrever");
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
