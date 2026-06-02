<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CategorieController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('locomotives.view');

        $categories = Categorie::withCount('locomotives')
            ->orderBy('nom')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('locomotives.create');

        return Inertia::render('Categories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('locomotives.create');

        $validated = $request->validate([
            'nom'         => ['required', 'string', 'max:255', 'unique:categories,nom'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        Categorie::create($validated);

        return redirect()->route('categories.index')
                         ->with('success', 'Catégorie créée avec succès.');
    }

    public function edit(Categorie $categorie): Response
    {
        Gate::authorize('locomotives.update');

        return Inertia::render('Categories/Edit', [
            'categorie' => $categorie,
        ]);
    }

    public function update(Request $request, Categorie $categorie): RedirectResponse
    {
        Gate::authorize('locomotives.update');

        $validated = $request->validate([
            'nom' => [
                'required',
                'string',
                'max:255',
                \Illuminate\Validation\Rule::unique('categories', 'nom')->ignore($categorie->id),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $categorie->update($validated);

        return redirect()->route('categories.index')
                         ->with('success', 'Catégorie mise à jour avec succès.');
    }

    public function destroy(Categorie $categorie): RedirectResponse
    {
        Gate::authorize('locomotives.delete');

        if ($categorie->locomotives()->exists()) {
            return redirect()->back()
                             ->with('error', 'Impossible de supprimer une catégorie qui contient des locomotives.');
        }

        $categorie->delete();

        return redirect()->route('categories.index')
                         ->with('success', 'Catégorie supprimée avec succès.');
    }
}
