import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Locomotive } from '@/types/locomotive';
import { KpiData } from '@/types/kpi';
import KpiSummaryCards from '@/Components/Kpi/KpiSummaryCards';
import ParetoChart from '@/Components/Kpi/ParetoChart';
import MtbfMttrChart from '@/Components/Kpi/MtbfMttrChart';
import AvailabilityGauge from '@/Components/Kpi/AvailabilityGauge';
import AmdecChart from '@/Components/Kpi/AmdecChart';
import { Card, CardContent } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { RefreshCwIcon } from 'lucide-react';

interface Props {
    locomotives: Locomotive[];
    filters: {
        locomotive_id: number | null;
        type: string;
        period: string;
    };
    kpiData: KpiData | null;
    selectedLocomotive?: Locomotive;
}

export default function Index({ locomotives, filters, kpiData, selectedLocomotive }: Props) {
    const [locoId, setLocoId] = useState(filters.locomotive_id || '');
    const [type, setType] = useState(filters.type || 'all');
    const [period, setPeriod] = useState(filters.period || 'all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const applyFilters = () => {
        if (!locoId) return;
        router.get(route('kpi.show', locoId), { type, period }, { preserveState: true });
    };

    const handleRefresh = () => {
        if (!locoId) return;
        setIsRefreshing(true);
        router.post(route('kpi.refresh', locoId), { type, period }, {
            onFinish: () => setIsRefreshing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Analyse de Fiabilité & KPI</h2>}
        >
            <Head title="KPI & Fiabilité" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Filtres */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="space-y-2">
                                    <Label>Locomotive</Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={locoId}
                                        onChange={e => setLocoId(e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">Sélectionnez...</option>
                                        {locomotives.map(loco => (
                                            <option key={loco.id} value={loco.id}>{loco.name} ({loco.model})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Type de Maintenance</Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={type}
                                        onChange={e => setType(e.target.value)}
                                    >
                                        <option value="all">Tous types</option>
                                        <option value="preventive">Préventive</option>
                                        <option value="corrective">Corrective</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Période</Label>
                                    <input 
                                        type="month"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={period === 'all' ? '' : period}
                                        onChange={e => setPeriod(e.target.value || 'all')}
                                        placeholder="YYYY-MM"
                                    />
                                    <p className="text-xs text-slate-400">Laissez vide pour la période globale</p>
                                </div>
                                <div>
                                    <Button onClick={applyFilters} disabled={!locoId} className="w-full">
                                        Analyser
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dashboard */}
                    {kpiData ? (
                        <>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-700">
                                    Résultats pour {selectedLocomotive?.name} 
                                    <span className="text-sm font-normal text-slate-500 ml-2">
                                        (Dernier calcul: {new Date(kpiData.computed_at).toLocaleString()})
                                    </span>
                                </h3>
                                <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                                    <RefreshCwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    Forcer le recalcul
                                </Button>
                            </div>

                            <KpiSummaryCards data={kpiData} />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <AvailabilityGauge availability={kpiData.availability} />
                                <MtbfMttrChart data={kpiData.history} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ParetoChart data={kpiData.pareto} />
                                <AmdecChart data={kpiData.amdec} />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-slate-500">
                            Sélectionnez une locomotive et cliquez sur "Analyser" pour afficher le tableau de bord de fiabilité.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
