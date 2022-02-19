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
            $table->unsignedBigInteger("id_endereco");
            $table->string("habANAC")->nullable(true);
            $table->string("CPF")->nullable(true);
            $table->string("CNPJ")->nullable(true);
            $table->string("telefone")->nullable(true);
            $table->string("celular")->nullable(true);
            $table->string("razaoSocial")->nullable(true);
            $table->string("nomeFantasia")->nullable(true);
            $table->foreign('id_endereco')->references('id')->on('address')->onDelete('cascade');
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
