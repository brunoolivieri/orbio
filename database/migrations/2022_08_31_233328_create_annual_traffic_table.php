<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnualTrafficTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('annual_traffic', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->integer("january")->nullable(true);
            $table->integer("february")->nullable(true);
            $table->integer("march")->nullable(true);
            $table->integer("april")->nullable(true);
            $table->integer("may")->nullable(true);
            $table->integer("june")->nullable(true);
            $table->integer("july")->nullable(true);
            $table->integer("august")->nullable(true);
            $table->integer("september")->nullable(true);
            $table->integer("october")->nullable(true);
            $table->integer("november")->nullable(true);
            $table->integer("december")->nullable(true);
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
        Schema::dropIfExists('annual_traffic');
    }
}
