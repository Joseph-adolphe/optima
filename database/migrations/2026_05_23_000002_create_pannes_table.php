<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pannes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('locomotive_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['preventive', 'corrective']);
            $table->enum('status', ['en_cours', 'terminee'])->default('en_cours');
            $table->text('description');
            $table->dateTime('failed_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pannes');
    }
};
