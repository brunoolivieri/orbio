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
            $table->unsignedBigInteger("id_relatorio");
            $table->unsignedBigInteger("id_incidente");
            $table->text("arquivo");
            $table->text("descricao");
            $table->boolean("status")->default(false);
            $table->foreign('id_relatorio')->references('id')->on('reports')->onDelete('cascade');
            $table->foreign('id_incidente')->references('id')->on('incidents')->onDelete('cascade');
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
