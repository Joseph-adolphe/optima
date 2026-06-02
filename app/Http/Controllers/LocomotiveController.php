<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLocomotiveRequest;
use App\Http\Requests\UpdateLocomotiveRequest;
use App\Models\Categorie;
use App\Models\Locomotive;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LocomotiveController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Locomotive::class);

        $query = Locomotive::with('categorie')->withCount('pannes');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhereHas('categorie', fn ($q) => $q->where('nom', 'like', "%{$search}%"));
        }

        if ($categorieId = $request->input('categorie_id')) {
            $query->where('categorie_id', $categorieId);
        }

        $locomotives = $query->latest()->paginate(15)->withQueryString();
        $categories  = Categorie::orderBy('nom')->get(['id', 'nom']);

        return Inertia::render('Locomotives/Index', [
            'locomotives' => $locomotives,
            'categories'  => $categories,
            'filters'     => $request->only(['search', 'categorie_id']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Locomotive::class);

        $categories = Categorie::orderBy('nom')->get(['id', 'nom']);
        $cycles = \App\Models\MaintenanceCycle::orderBy('nom')->get(['id', 'nom']);

        return Inertia::render('Locomotives/Create', [
            'categories' => $categories,
            'cycles' => $cycles,
        ]);
    }

    public function store(StoreLocomotiveRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('locomotives', 'public');
        }

        Locomotive::create($validated);

        return redirect()->route('locomotives.index')
                         ->with('success', 'Locomotive ajoutée avec succès.');
    }

    public function show(Locomotive $locomotive): Response
    {
        $this->authorize('view', $locomotive);

        $locomotive->load(['categorie', 'ordresTravail.rule', 'pannes'])->loadCount('pannes');

        $recentPannes = $locomotive->pannes()
            ->latest('failed_at')
            ->take(5)
            ->get();

        // Construire la timeline
        $pannesEvents = $locomotive->pannes->map(function ($panne) {
            return [
                'id' => 'p_' . $panne->id,
                'type' => 'correctif',
                'title' => 'Panne: ' . $panne->symptoms,
                'date' => $panne->failed_at ? $panne->failed_at->toIso8601String() : $panne->created_at->toIso8601String(),
                'status' => $panne->status,
                'description' => 'Sévérité: ' . $panne->severity,
                'link' => route('pannes.show', $panne->id),
            ];
        });

        $ordresEvents = $locomotive->ordresTravail->map(function ($ot) {
            return [
                'id' => 'ot_' . $ot->id,
                'type' => 'preventif',
                'title' => 'Intervention ' . ($ot->rule ? $ot->rule->nom : 'Préventive'),
                'date' => $ot->date_prevue ? $ot->date_prevue : $ot->created_at->toIso8601String(),
                'status' => $ot->statut,
                'description' => $ot->kilometrage_prevu ? 'Kilométrage prévu: ' . $ot->kilometrage_prevu . ' km' : 'Échéance calendaire',
                'link' => route('ordres-travail.index'),
            ];
        });

        $timeline = collect($pannesEvents)->concat($ordresEvents)->sortByDesc('date')->values()->all();

        return Inertia::render('Locomotives/Show', [
            'locomotive'   => $locomotive,
            'recentPannes' => $recentPannes,
            'timeline'     => $timeline,
        ]);
    }

    public function edit(Locomotive $locomotive): Response
    {
        $this->authorize('update', $locomotive);

        $categories = Categorie::orderBy('nom')->get(['id', 'nom']);
        $cycles = \App\Models\MaintenanceCycle::orderBy('nom')->get(['id', 'nom']);

        return Inertia::render('Locomotives/Edit', [
            'locomotive' => $locomotive->load('categorie'),
            'categories' => $categories,
            'cycles' => $cycles,
        ]);
    }

    public function update(UpdateLocomotiveRequest $request, Locomotive $locomotive): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            if ($locomotive->photo_path) {
                Storage::disk('public')->delete($locomotive->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('locomotives', 'public');
        }

        $locomotive->update($validated);

        return redirect()->route('locomotives.show', $locomotive)
                         ->with('success', 'Locomotive mise à jour avec succès.');
    }

    public function destroy(Locomotive $locomotive): RedirectResponse
    {
        $this->authorize('delete', $locomotive);

        if ($locomotive->photo_path) {
            Storage::disk('public')->delete($locomotive->photo_path);
        }

        $locomotive->delete();

        return redirect()->route('locomotives.index')
                         ->with('success', 'Locomotive supprimée avec succès.');
    }
}
