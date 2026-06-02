<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFicheRequest;
use App\Models\Fiche;
use App\Models\Panne;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FicheController extends Controller
{
    public function store(StoreFicheRequest $request, Panne $panne): RedirectResponse
    {
        $step    = (int) $request->input('step');
        $payload = $request->input('payload', []);

        $ficheData = [
            'panne_id' => $panne->id,
            'step'     => $step,
            'payload'  => $payload,
        ];

        // Step 2 : on capture le technicien dans la colonne dédiée
        if ($step === 2) {
            $ficheData['technician'] = $payload['technicien'] ?? null;
        }

        // Step 3 : calcul auto de la durée de réparation en minutes
        if ($step === 3) {
            $start = Carbon::parse($payload['started_at']);
            $end   = Carbon::parse($payload['ended_at']);
            $ficheData['started_at']      = $start;
            $ficheData['ended_at']        = $end;
            $ficheData['repair_duration'] = (int) $start->diffInMinutes($end);
        }

        // Step 4 : noter les observations générales
        if ($step === 4) {
            $ficheData['notes'] = $payload['observations_finales'] ?? null;
        }

        // Upsert : remplacer la fiche si elle existe déjà pour ce step
        Fiche::updateOrCreate(
            ['panne_id' => $panne->id, 'step' => $step],
            $ficheData
        );

        // Redirection vers le step suivant ou le show de la panne
        $nextStep = $step + 1;
        if ($nextStep <= 4) {
            return redirect()
                ->route('pannes.show', $panne)
                ->with('next_step', $nextStep)
                ->with('success', "Fiche {$step} enregistrée. Passez à la fiche {$nextStep}.");
        }

        return redirect()
            ->route('pannes.show', $panne)
            ->with('success', 'Toutes les fiches sont complètes. La panne est maintenant terminée.');
    }

    public function show(Panne $panne, Fiche $fiche): Response
    {
        $this->authorize('view', $panne);

        $fiche->load('panne.locomotive');

        return Inertia::render('Fiches/Show', [
            'fiche' => $fiche,
            'panne' => $panne->load('locomotive'),
        ]);
    }
}
