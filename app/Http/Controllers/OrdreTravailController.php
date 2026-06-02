<?php

namespace App\Http\Controllers;

use App\Models\OrdreTravail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrdreTravailController extends Controller
{
    public function index()
    {
        $ordres = OrdreTravail::with(['locomotive', 'rule'])->orderBy('date_prevue', 'asc')->get();

        return Inertia::render('OrdresTravail/Index', [
            'ordres' => $ordres,
        ]);
    }

    public function updateStatut(Request $request, OrdreTravail $ordreTravail)
    {
        $validated = $request->validate([
            'statut' => 'required|in:en_attente,en_cours,termine,annule',
        ]);

        $ordreTravail->update($validated);

        return redirect()->back()->with('success', 'Statut de l\'Ordre de Travail mis à jour.');
    }
}
