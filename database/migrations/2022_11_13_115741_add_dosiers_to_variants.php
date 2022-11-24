<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('variants', function (Blueprint $table) {
            $table->string('dosier')->nullable();
            $table->integer('price_fai')->nullable();
            $table->integer('price_gb')->nullable();
            $table->integer('pvp_fai')->nullable();
            $table->integer('pvp_gb')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('variants', function (Blueprint $table) {
            $table->dropColumn('dosier');
            $table->dropColumn('price_fai');
            $table->dropColumn('price_gb');
            $table->dropColumn('pvp_fai');
            $table->dropColumn('pvp_gb');
        });
    }
};
