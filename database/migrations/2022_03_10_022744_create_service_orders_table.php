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
            $table->uuid("uuid");
            $table->foreignId("report_id")->nullable(true)->constrained('reports');
            $table->string("number");
            $table->dateTime("start_date");
            $table->dateTime("end_date");
            $table->boolean("status")->default(false);
            $table->text("observation");
            $table->timestamps();
            $table->softDeletes();
        });

        // Relationship with flight plans and equipments
        Schema::create('service_order_flight_plan', function (Blueprint $table) {
            $table->id();
            $table->foreignId("service_order_id")->constrained('service_orders');
            $table->foreignId("flight_plan_id")->constrained('flight_plans');
            $table->foreignId('drone_id')->nullable(true)->constrained('drones');
            $table->foreignId('battery_id')->nullable(true)->constrained('batteries');
            $table->foreignId('equipment_id')->nullable(true)->constrained('equipments');
        });

        // Relationship with users
        Schema::create('service_order_user', function (Blueprint $table) {
            $table->foreignId("service_order_id")->constrained('service_orders');
            $table->foreignId("user_id")->constrained('users');
            $table->string("role");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('service_order_user');
        Schema::dropIfExists('service_order_flight_plan');
        Schema::dropIfExists('service_orders');
    }
}
