<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnualAccessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('annual_accesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->references("users");
            $table->boolean("january")->default(false);
            $table->boolean("february")->default(false);
            $table->boolean("march")->default(false);
            $table->boolean("april")->default(false);
            $table->boolean("may")->default(false);
            $table->boolean("june")->default(false);
            $table->boolean("jully")->default(false);
            $table->boolean("august")->default(false);
            $table->boolean("september")->default(false);
            $table->boolean("october")->default(false);
            $table->boolean("november")->default(false);
            $table->boolean("december")->default(false);
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
        Schema::dropIfExists('annual_accesses');
    }
}
