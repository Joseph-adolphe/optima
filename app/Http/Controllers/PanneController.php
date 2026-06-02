<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePanneRequest;
use App\Http\Requests\UpdatePanneRequest;
use App\Models\Locomotive;
use App\Models\Panne;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PanneController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Panne::class);

        $query = Panne::with('locomotive')
            ->withCount('fiches');

        // Filtre par locomotive
        if ($locomotiveId = $request->input('locomotive_id')) {
            $query->where('locomotive_id', $locomotiveId);
        }

        // Filtre par type
        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        // Filtre par statut
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Filtre par période
        if ($from = $request->input('from')) {
            $query->whereDate('failed_at', '>=', $from);
        }
        if ($to = $request->input('to')) {
            $query->whereDate('failed_at', '<=', $to);
        }

        $pannes = $query->latest('failed_at')->paginate(15)->withQueryString();

        $locomotives = Locomotive::orderBy('name')->get(['id', 'name', 'model']);

        return Inertia::render('Pannes/Index', [
            'pannes'      => $pannes,
            'locomotives' => $locomotives,
            'filters'     => $request->only(['locomotive_id', 'type', 'status', 'from', 'to']),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Panne::class);

        $locomotives = Locomotive::orderBy('name')->get(['id', 'name', 'model']);
        $preselectedLoco = $request->input('locomotive_id')
            ? Locomotive::findOrFail($request->input('locomotive_id'))
            : null;

        return Inertia::render('Pannes/Create', [
            'locomotives'    => $locomotives,
            'preselectedLoco' => $preselectedLoco,
        ]);
    }

    public function store(StorePanneRequest $request): RedirectResponse
    {
        $panne = Panne::create($request->validated());

        if ($panne->status === 'terminee') {
            return redirect()
                ->route('pannes.show', $panne)
                ->with('success', 'Panne créée. Complétez maintenant les 4 fiches d\'intervention.');
        }

        return redirect()
            ->route('pannes.show', $panne)
            ->with('success', 'Panne enregistrée avec succès.');
    }

    public function show(Panne $panne): Response
    {
        $this->authorize('view', $panne);

        $panne->load(['locomotive', 'fiches' => fn($q) => $q->orderBy('step')]);

        return Inertia::render('Pannes/Show', [
            'panne' => $panne,
        ]);
    }

    public function edit(Panne $panne): Response
    {
        $this->authorize('update', $panne);

        $locomotives = Locomotive::orderBy('name')->get(['id', 'name', 'model']);

        return Inertia::render('Pannes/Edit', [
            'panne'       => $panne->load('locomotive'),
            'locomotives' => $locomotives,
        ]);
    }

    public function update(UpdatePanneRequest $request, Panne $panne): RedirectResponse
    {
        $panne->update($request->validated());

        return redirect()
            ->route('pannes.show', $panne)
            ->with('success', 'Panne mise à jour avec succès.');
    }

    public function destroy(Panne $panne): RedirectResponse
    {
        $this->authorize('delete', $panne);

        $locomotiveId = $panne->locomotive_id;
        $panne->fiches()->delete();
        $panne->delete();

        return redirect()
            ->route('pannes.index', ['locomotive_id' => $locomotiveId])
            ->with('success', 'Panne supprimée avec succès.');
    }
}
