<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiceOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_plano_voo')->nullable(true)->constrained('flight_plans');
            $table->string("numOS");
            $table->dateTime("dh_atualizacao")->nullable(true);
            $table->dateTime("dh_criacao")->useCurrent();
            $table->dateTime("dh_inicio");
            $table->dateTime("dh_fim");
            $table->boolean("status")->default(false);
            $table->string("nome_criador");
            $table->string("nome_piloto");
            $table->string("nome_cliente");
            $table->text("observacao");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('service_orders');
    }
}
