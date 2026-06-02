<?php

namespace App\Http\Controllers;

use App\Models\Locomotive;
use App\Services\KpiCacheService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KpiController extends Controller
{
    public function index()
    {
        $locomotives = Locomotive::orderBy('name')->get(['id', 'name', 'model']);

        return Inertia::render('Kpi/Index', [
            'locomotives' => $locomotives,
            'filters' => [
                'locomotive_id' => null,
                'type' => 'all',
                'period' => 'all',
            ],
            'kpiData' => null,
        ]);
    }

    public function show(Request $request, KpiCacheService $kpiCacheService, Locomotive $locomotive)
    {
        $locomotives = Locomotive::orderBy('name')->get(['id', 'name', 'model']);
        
        $type = $request->input('type', 'all');
        $period = $request->input('period', 'all');

        $kpiData = $kpiCacheService->getKpiData($locomotive->id, $type, $period);

        return Inertia::render('Kpi/Index', [
            'locomotives' => $locomotives,
            'filters' => [
                'locomotive_id' => $locomotive->id,
                'type' => $type,
                'period' => $period,
            ],
            'kpiData' => $kpiData,
            'selectedLocomotive' => $locomotive,
        ]);
    }

    public function refresh(Request $request, KpiCacheService $kpiCacheService, Locomotive $locomotive)
    {
        $type = $request->input('type', 'all');
        $period = $request->input('period', 'all');

        $kpiCacheService->getKpiData($locomotive->id, $type, $period, true);

        return redirect()->route('kpi.show', [
            'locomotive' => $locomotive->id,
            'type' => $type,
            'period' => $period,
        ])->with('success', 'Indicateurs de fiabilité recalculés avec succès.');
    }
}
