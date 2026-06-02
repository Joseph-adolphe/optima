<?php

namespace App\Console\Commands;

use App\Models\Locomotive;
use App\Models\OrdreTravail;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateWorkOrders extends Command
{
    protected $signature = 'maintenance:generate';
    protected $description = 'Génère les ordres de travail préventifs (calendaires et kilométriques)';

    public function handle()
    {
        $this->info('Début de la vérification des règles de maintenance préventive...');

        $locomotives = Locomotive::with(['maintenanceCycle.rules'])->whereNotNull('maintenance_cycle_id')->get();

        $generatedCount = 0;

        foreach ($locomotives as $loco) {
            if (!$loco->maintenanceCycle) continue;

            foreach ($loco->maintenanceCycle->rules as $rule) {
                // Chercher le dernier OT terminé pour cette règle et cette loco
                $lastOt = OrdreTravail::where('locomotive_id', $loco->id)
                    ->where('maintenance_rule_id', $rule->id)
                    ->where('statut', 'termine')
                    ->orderBy('updated_at', 'desc')
                    ->first();

                $shouldGenerate = false;
                $datePrevue = null;
                $kmPrevu = null;

                if ($rule->type === 'calendaire') {
                    // Si jamais fait, on se base sur la date de mise en service (commissioned_at)
                    $baseDate = $lastOt ? $lastOt->updated_at : Carbon::parse($loco->commissioned_at ?? now());
                    $echeance = $baseDate->copy()->addDays($rule->intervalle);
                    
                    // Si l'échéance moins le seuil d'alerte est dépassée
                    if (now()->greaterThanOrEqualTo($echeance->copy()->subDays($rule->seuil_alerte))) {
                        $shouldGenerate = true;
                        $datePrevue = $echeance;
                    }
                } elseif ($rule->type === 'kilometrique') {
                    // Si jamais fait, on considère base km = 0
                    $baseKm = $lastOt ? ($lastOt->kilometrage_prevu ?? 0) : 0;
                    $echeanceKm = $baseKm + $rule->intervalle;
                    
                    if ($loco->kilometrage_actuel >= ($echeanceKm - $rule->seuil_alerte)) {
                        $shouldGenerate = true;
                        $kmPrevu = $echeanceKm;
                    }
                }

                if ($shouldGenerate) {
                    // Vérifier si un OT en attente ou en cours n'existe pas déjà pour cette règle
                    $existingOt = OrdreTravail::where('locomotive_id', $loco->id)
                        ->where('maintenance_rule_id', $rule->id)
                        ->whereIn('statut', ['en_attente', 'en_cours'])
                        ->exists();

                    if (!$existingOt) {
                        OrdreTravail::create([
                            'locomotive_id' => $loco->id,
                            'maintenance_rule_id' => $rule->id,
                            'statut' => 'en_attente',
                            'date_prevue' => $datePrevue,
                            'kilometrage_prevu' => $kmPrevu,
                        ]);
                        $this->info("OT généré pour la locomotive {$loco->name} (Règle: {$rule->nom})");
                        $generatedCount++;
                    }
                }
            }
        }

        $this->info("Génération terminée. {$generatedCount} Ordre(s) de Travail créé(s).");
    }
}
