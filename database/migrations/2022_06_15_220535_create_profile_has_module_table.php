<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfileHasModuleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profile_has_module', function (Blueprint $table) {
            $table->foreignId('module_id')->constrained('modules');
            $table->foreignId('profile_id')->constrained('profiles')->onDelete('cascade');
            $table->boolean("read");
            $table->boolean("write");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profile_has_module');
    }
}
