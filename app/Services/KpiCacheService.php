<?php

namespace App\Services;

use App\Models\KpiCache;
use Carbon\Carbon;

class KpiCacheService
{
    protected KpiService $kpiService;

    public function __construct(KpiService $kpiService)
    {
        $this->kpiService = $kpiService;
    }

    public function getKpiData(int $locoId, string $type, string $period, bool $forceRefresh = false): array
    {
        // For type and period combinations, AMDEC and Pareto don't fit perfectly in KpiCache model columns
        // The KpiCache model only has: mtbf, mttr, availability.
        // We will cache them there. Pareto and AMDEC can be calculated on the fly or cached in another way.
        // Since the prompt asks to "vérifie kpi_cache avant de recalculer", we'll check it.

        $cache = KpiCache::where('locomotive_id', $locoId)
            ->where('type', $type)
            ->where('period', $period)
            ->first();

        $needsRecalculation = true;

        if ($cache && !$forceRefresh) {
            // Recalcul automatique si computed_at > 24h
            if ($cache->computed_at && $cache->computed_at->diffInHours(now()) < 24) {
                $needsRecalculation = false;
            }
        }

        if ($needsRecalculation) {
            $mtbf = $this->kpiService->mtbf($locoId, $type, $period);
            $mttr = $this->kpiService->mttr($locoId, $type, $period);
            $availability = $this->kpiService->availability($mtbf, $mttr);

            $cache = KpiCache::updateOrCreate(
                [
                    'locomotive_id' => $locoId,
                    'type' => $type,
                    'period' => $period,
                ],
                [
                    'mtbf' => $mtbf,
                    'mttr' => $mttr,
                    'availability' => $availability,
                    'computed_at' => now(),
                ]
            );
        }

        // Calculate dynamic arrays (Pareto, AMDEC)
        // Usually these could be cached in Redis/Cache facade, but the instruction implies KpiCache is for MTBF/MTTR/Availability.
        $pareto = $this->kpiService->pareto($locoId, $type, $period);
        $amdec = $this->kpiService->amdec($locoId, $period);

        // Fetch count of pannes for the current filters
        $pannesCount = \App\Models\Panne::where('locomotive_id', $locoId)
            ->where('status', 'terminee')
            ->when($type !== 'all' && $type !== '', fn($q) => $q->where('type', $type))
            ->when($period !== 'all', function ($q) use ($period) {
                [$year, $month] = explode('-', $period);
                return $q->whereYear('failed_at', $year)->whereMonth('failed_at', $month);
            })
            ->count();

        // Calculate trends vs previous period (if period is not 'all')
        $trends = $this->calculateTrends($locoId, $type, $period, $cache->mtbf, $cache->mttr, $cache->availability, $pannesCount);

        // Fetch history for MtbfMttrChart
        $history = $this->getHistory($locoId, $type, $period);

        return [
            'mtbf' => (float) $cache->mtbf,
            'mttr' => (float) $cache->mttr,
            'availability' => (float) $cache->availability,
            'pannesCount' => $pannesCount,
            'trends' => $trends,
            'pareto' => $pareto,
            'amdec' => $amdec,
            'history' => $history,
            'computed_at' => $cache->computed_at->toIso8601String(),
        ];
    }

    protected function getHistory(int $locoId, string $type, string $period): array
    {
        $history = [];
        $baseDate = $period === 'all' ? Carbon::now() : Carbon::createFromFormat('Y-m', $period);

        for ($i = 5; $i >= 0; $i--) {
            $monthDate = $baseDate->copy()->subMonths($i);
            $monthPeriod = $monthDate->format('Y-m');

            $cache = KpiCache::where('locomotive_id', $locoId)
                ->where('type', $type)
                ->where('period', $monthPeriod)
                ->first();

            if ($cache) {
                $mtbf = (float) $cache->mtbf;
                $mttr = (float) $cache->mttr;
            } else {
                $mtbf = $this->kpiService->mtbf($locoId, $type, $monthPeriod);
                $mttr = $this->kpiService->mttr($locoId, $type, $monthPeriod);
                // Optionally we could save this to cache too, but to avoid slow loads we just compute.
            }

            $history[] = [
                'month' => $monthDate->translatedFormat('M Y'),
                'mtbf' => $mtbf,
                'mttr' => $mttr,
            ];
        }

        return $history;
    }

    protected function calculateTrends(int $locoId, string $type, string $period, float $mtbf, float $mttr, float $availability, int $pannesCount): array
    {
        if ($period === 'all') {
            return ['mtbf' => 0, 'mttr' => 0, 'availability' => 0, 'pannesCount' => 0];
        }

        // Get previous period
        [$year, $month] = explode('-', $period);
        $prevPeriodDate = Carbon::createFromDate($year, $month, 1)->subMonth();
        $prevPeriod = $prevPeriodDate->format('Y-m');

        // Fetch prev cache or calculate
        $prevCache = KpiCache::where('locomotive_id', $locoId)
            ->where('type', $type)
            ->where('period', $prevPeriod)
            ->first();

        $prevMtbf = 0;
        $prevMttr = 0;
        $prevAvailability = 0;

        if ($prevCache) {
            $prevMtbf = (float) $prevCache->mtbf;
            $prevMttr = (float) $prevCache->mttr;
            $prevAvailability = (float) $prevCache->availability;
        } else {
            $prevMtbf = $this->kpiService->mtbf($locoId, $type, $prevPeriod);
            $prevMttr = $this->kpiService->mttr($locoId, $type, $prevPeriod);
            $prevAvailability = $this->kpiService->availability($prevMtbf, $prevMttr);
        }

        $prevPannesCount = \App\Models\Panne::where('locomotive_id', $locoId)
            ->where('status', 'terminee')
            ->when($type !== 'all' && $type !== '', fn($q) => $q->where('type', $type))
            ->whereYear('failed_at', $prevPeriodDate->year)
            ->whereMonth('failed_at', $prevPeriodDate->month)
            ->count();

        return [
            'mtbf' => $prevMtbf > 0 ? round((($mtbf - $prevMtbf) / $prevMtbf) * 100, 1) : 0,
            'mttr' => $prevMttr > 0 ? round((($mttr - $prevMttr) / $prevMttr) * 100, 1) : 0,
            'availability' => $availability - $prevAvailability, // absolute difference for %
            'pannesCount' => $pannesCount - $prevPannesCount,
        ];
    }
}
