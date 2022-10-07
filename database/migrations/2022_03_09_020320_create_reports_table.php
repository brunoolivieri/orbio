<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string("path");
            $table->text("observation")->nullable(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('report_flight_plan', function (Blueprint $table) {
            $table->foreignId('report_id')->constrained('modules');
            $table->foreignId('flight_plan_id')->constrained('profiles')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reports');
        Schema::dropIfExists('report_flight_plan');
    }
}
