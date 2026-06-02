import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AmdecItem } from '@/types/kpi';

export default function AmdecChart({ data }: { data: AmdecItem[] }) {
    if (!data || data.length === 0) return null;

    const getColor = (level: string) => {
        switch (level) {
            case 'critique': return '#ef4444'; // red-500
            case 'important': return '#f97316'; // orange-500
            default: return '#3b82f6'; // blue-500
        }
    };

    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle>Matrice de Criticité (AMDEC)</CardTitle>
                <CardDescription>Évaluation basée sur Occurrence × Gravité × Détection</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false}/>
                            <XAxis type="number" />
                            <YAxis dataKey="component" type="category" width={120} tick={{fontSize: 12}} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                            <Bar dataKey="criticality" name="Indice de Criticité" radius={[0, 4, 4, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColor(entry.level)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
