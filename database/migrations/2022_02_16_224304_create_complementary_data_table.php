<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComplementaryDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('personal_document', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->nullable(true);
            $table->foreignId('address_id')->constrained('address')->nullable(true);
            $table->string("anac_license")->nullable(true);
            $table->string("cpf")->nullable(true);
            $table->string("cnpj")->nullable(true);
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
        Schema::dropIfExists('personal_document');
    }
}
