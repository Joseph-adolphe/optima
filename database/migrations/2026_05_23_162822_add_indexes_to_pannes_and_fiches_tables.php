<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pannes', function (Blueprint $table) {
            $table->index(['locomotive_id', 'status']);
            $table->index('failed_at');
            $table->index('type');
            $table->index('status');
        });

        Schema::table('fiches', function (Blueprint $table) {
            $table->index(['panne_id', 'step']);
            $table->index('step');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pannes_and_fiches_tables', function (Blueprint $table) {
            //
        });
    }
};
