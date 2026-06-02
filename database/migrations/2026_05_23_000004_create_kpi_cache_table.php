<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kpi_cache', function (Blueprint $table) {
            $table->id();
            $table->foreignId('locomotive_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('period', 7); // ex: "2026-05"
            $table->decimal('mtbf', 8, 2);
            $table->decimal('mttr', 8, 2);
            $table->decimal('availability', 5, 2);
            $table->dateTime('computed_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpi_cache');
    }
};
