<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiceOrderHasFlightPlan extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_order_has_flight_plan', function (Blueprint $table) {
            $table->foreignId("id_ordem_servico")->constrained('service_orders');
            $table->foreignId("id_plano_voo")->constrained('flight_plans');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('service_order_has_flight_plan');
    }
}
