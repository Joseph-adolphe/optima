import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ParetoItem } from '@/types/kpi';

export default function ParetoChart({ data }: { data: ParetoItem[] }) {
    if (!data || data.length === 0) return null;

    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle>Analyse de Pareto des Pannes</CardTitle>
                <CardDescription>Visualise les composants les plus critiques (Loi des 80/20)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} tick={{fontSize: 12}} />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#ef4444" domain={[0, 100]} />
                            <Tooltip />
                            <Legend wrapperStyle={{paddingTop: '20px'}}/>
                            <Bar yAxisId="left" dataKey="count" name="Nb Pannes" barSize={40} fill="#8884d8" radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="cumulative" name="% Cumulé" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} />
                            <ReferenceLine yAxisId="right" y={80} stroke="red" strokeDasharray="3 3" label="80%" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
