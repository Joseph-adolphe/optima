<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceCycle;
use App\Models\MaintenanceRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AdminMaintenanceController extends Controller
{
    public function index()
    {
        // On réutilise la permission admin.view (ou créer une spécifique plus tard)
        Gate::authorize('admin.view');

        $cycles = MaintenanceCycle::with('rules')->get();

        return Inertia::render('Admin/Maintenance/Cycles', [
            'cycles' => $cycles,
        ]);
    }

    public function storeCycle(Request $request)
    {
        Gate::authorize('admin.view');

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        MaintenanceCycle::create($validated);

        return redirect()->back()->with('success', 'Cycle de maintenance créé avec succès.');
    }

    public function updateCycle(Request $request, MaintenanceCycle $cycle)
    {
        Gate::authorize('admin.view');

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $cycle->update($validated);

        return redirect()->back()->with('success', 'Cycle mis à jour.');
    }

    public function destroyCycle(MaintenanceCycle $cycle)
    {
        Gate::authorize('admin.view');
        $cycle->delete();
        return redirect()->back()->with('success', 'Cycle supprimé.');
    }

    // -- Règles (Rules) --

    public function storeRule(Request $request, MaintenanceCycle $cycle)
    {
        Gate::authorize('admin.view');

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|in:calendaire,kilometrique',
            'intervalle' => 'required|integer|min:1',
            'seuil_alerte' => 'required|integer|min:0',
        ]);

        $cycle->rules()->create($validated);

        return redirect()->back()->with('success', 'Règle de maintenance ajoutée.');
    }

    public function updateRule(Request $request, MaintenanceRule $rule)
    {
        Gate::authorize('admin.view');

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|in:calendaire,kilometrique',
            'intervalle' => 'required|integer|min:1',
            'seuil_alerte' => 'required|integer|min:0',
        ]);

        $rule->update($validated);

        return redirect()->back()->with('success', 'Règle mise à jour.');
    }

    public function destroyRule(MaintenanceRule $rule)
    {
        Gate::authorize('admin.view');
        $rule->delete();
        return redirect()->back()->with('success', 'Règle supprimée.');
    }
}
