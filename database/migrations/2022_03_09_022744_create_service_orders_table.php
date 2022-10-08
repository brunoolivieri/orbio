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
            $table->foreignId("report_id")->constrained('reports')->nullable(true);
            $table->string("number");
            $table->dateTime("start_date");
            $table->dateTime("end_date");
            $table->boolean("status")->default(false);
            $table->text("observation");
            $table->timestamps();
            $table->softDeletes();
        });

        // Relationship with users
        Schema::create('service_order_user', function (Blueprint $table) {
            $table->foreignId("service_order_id")->constrained('service_orders');
            $table->foreignId("user_id")->constrained('users');
            $table->string("role");
        });

        // Relationship with flight plans 
        Schema::create('service_order_flight_plan', function (Blueprint $table) {
            $table->foreignId("service_order_id")->constrained('service_orders');
            $table->foreignId("flight_plan_id")->constrained('flight_plans');
            $table->foreignId("incident_id")->constrained('incidents');
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
