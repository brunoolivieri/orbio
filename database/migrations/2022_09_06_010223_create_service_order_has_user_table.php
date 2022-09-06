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
            $table->foreignId("service_order_id")->constrained('service_orders');
            $table->foreignId("creator_id")->constrained('users');
            $table->foreignId("pilot_id")->constrained('users');
            $table->foreignId("client_id")->constrained('users');
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
