import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { KpiData } from '@/types/kpi';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

export default function KpiSummaryCards({ data }: { data: KpiData }) {
    const renderTrend = (value: number, inverse: boolean = false) => {
        if (value === 0) return <span className="flex items-center text-slate-500 text-sm"><MinusIcon className="w-4 h-4 mr-1" /> stable</span>;
        
        const isPositive = value > 0;
        const isGood = inverse ? !isPositive : isPositive;
        
        return (
            <span className={`flex items-center text-sm ${isGood ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                {Math.abs(value)}%
            </span>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">MTBF (Heures)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.mtbf}</div>
                    <div className="mt-1">{renderTrend(data.trends.mtbf)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">MTTR (Heures)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.mttr}</div>
                    <div className="mt-1">{renderTrend(data.trends.mttr, true)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Disponibilité (%)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.availability}%</div>
                    <div className="mt-1">{renderTrend(data.trends.availability)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Pannes signalées</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.pannesCount}</div>
                    <div className="mt-1 flex items-center text-sm">
                        {data.trends.pannesCount > 0 ? (
                            <span className="text-red-600 flex items-center"><ArrowUpIcon className="w-4 h-4 mr-1"/> {data.trends.pannesCount}</span>
                        ) : data.trends.pannesCount < 0 ? (
                            <span className="text-green-600 flex items-center"><ArrowDownIcon className="w-4 h-4 mr-1"/> {Math.abs(data.trends.pannesCount)}</span>
                        ) : (
                            <span className="text-slate-500 flex items-center"><MinusIcon className="w-4 h-4 mr-1"/> 0</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
