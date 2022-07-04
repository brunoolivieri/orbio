<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserComplementaryData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_complementary_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('address_id')->nullable(true)->constrained('address')->onDelete('cascade');
            $table->string("anac_license")->nullable(true);
            $table->string("CPF")->nullable(true);
            $table->string("CNPJ")->nullable(true);
            $table->string("telephone")->nullable(true);
            $table->string("cellphone")->nullable(true);
            $table->string("company_name")->nullable(true);
            $table->string("trading_name")->nullable(true);
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
        Schema::dropIfExists('user_complementary_data');
    }
}
