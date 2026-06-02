<?php

namespace App\Http\Controllers;

use App\Models\Locomotive;
use App\Models\Panne;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $locomotives = Locomotive::withCount(['pannes as total_pannes', 'pannes as pannes_en_cours' => function ($query) {
            $query->where('status', 'en_cours');
        }])->latest()->take(10)->get()->map(function ($loco) {
            return [
                'id' => $loco->id,
                'nom' => $loco->name,
                'modele' => $loco->model,
                'photo_url' => $loco->photo_path ? asset('storage/' . $loco->photo_path) : '',
                'total_pannes' => $loco->total_pannes,
                'pannes_en_cours' => $loco->pannes_en_cours,
            ];
        });

        $stats = [
            'total_locomotives' => Locomotive::count(),
            'total_pannes' => Panne::count(),
            'pannes_en_cours' => Panne::where('status', 'en_cours')->count(),
            'pannes_ce_mois' => Panne::whereMonth('failed_at', now()->month)
                                     ->whereYear('failed_at', now()->year)
                                     ->count(),
        ];

        return Inertia::render('Dashboard', [
            'locomotives' => $locomotives,
            'stats' => $stats,
        ]);
    }
}
