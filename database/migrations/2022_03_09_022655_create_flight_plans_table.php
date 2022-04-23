<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFlightPlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('flight_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_relatorio')->nullable(true)->constrained('reports')->onDelete('cascade');
            $table->foreignId('id_incidente')->nullable(true)->constrained('incidents')->onDelete('cascade');
            $table->text("arquivo");
            $table->text("descricao");
            $table->boolean("status")->default(false);
            $table->dateTime("dh_atualizacao")->nullable(true);
            $table->dateTime("dh_criacao")->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('flight_plans');
    }
}
