<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_cycles', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('maintenance_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('maintenance_cycle_id')->constrained('maintenance_cycles')->cascadeOnDelete();
            $table->string('nom'); // ex: VA, VB
            $table->enum('type', ['calendaire', 'kilometrique']);
            $table->integer('intervalle'); // Jours ou Kilomètres
            $table->integer('seuil_alerte')->default(0); // Jours ou Kilomètres avant échéance pour générer l'OT
            $table->timestamps();
        });

        Schema::create('ordres_travail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('locomotive_id')->constrained('locomotives')->cascadeOnDelete();
            $table->foreignId('maintenance_rule_id')->constrained('maintenance_rules')->cascadeOnDelete();
            $table->enum('statut', ['en_attente', 'en_cours', 'termine', 'annule'])->default('en_attente');
            $table->date('date_prevue')->nullable();
            $table->integer('kilometrage_prevu')->nullable();
            $table->timestamps();
        });

        Schema::table('locomotives', function (Blueprint $table) {
            $table->foreignId('maintenance_cycle_id')->nullable()->constrained('maintenance_cycles')->nullOnDelete();
            $table->integer('kilometrage_actuel')->default(0);
        });

        Schema::table('fiches', function (Blueprint $table) {
            $table->foreignId('ordre_travail_id')->nullable()->constrained('ordres_travail')->nullOnDelete();
            // Permettre à la fiche d'être non reliée à une panne si elle vient d'un OT
            $table->foreignId('panne_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('fiches', function (Blueprint $table) {
            $table->dropForeign(['ordre_travail_id']);
            $table->dropColumn('ordre_travail_id');
            // Revert panne_id (could be complex, but usually just change it back)
            $table->foreignId('panne_id')->nullable(false)->change();
        });

        Schema::table('locomotives', function (Blueprint $table) {
            $table->dropForeign(['maintenance_cycle_id']);
            $table->dropColumn(['maintenance_cycle_id', 'kilometrage_actuel']);
        });

        Schema::dropIfExists('ordres_travail');
        Schema::dropIfExists('maintenance_rules');
        Schema::dropIfExists('maintenance_cycles');
    }
};
