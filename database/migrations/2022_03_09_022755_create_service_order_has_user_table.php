<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiceOrderHasUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_order_has_user', function (Blueprint $table) {
            $table->unsignedBigInteger("id_ordem_servico");
            $table->unsignedBigInteger("id_usuario");
            $table->foreign('id_ordem_servico')->references('id')->on('service_orders');
            $table->foreign('id_usuario')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('service_order_has_user');
    }
}
