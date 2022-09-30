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
            $table->string("creator_id")->constrained('users');
            $table->string("name");
            $table->foreignId('incident_id')->nullable(true)->constrained('incidents')->onDelete('cascade');
            $table->string("file");
            $table->string("coordinates");
            $table->string("state");
            $table->string("city");
            $table->text("description");
            $table->timestamps();
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
        Schema::dropIfExists('flight_plans');
    }
}
