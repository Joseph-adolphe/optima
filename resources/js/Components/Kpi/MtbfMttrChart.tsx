import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoryItem } from '@/types/kpi';

export default function MtbfMttrChart({ data }: { data: HistoryItem[] }) {
    if (!data || data.length === 0) return null;

    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle>Évolution MTBF / MTTR</CardTitle>
                <CardDescription>Suivi des temps moyens de bon fonctionnement et de réparation sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" tick={{fontSize: 12}} />
                            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" name="MTBF (h)" />
                            <YAxis yAxisId="right" orientation="right" stroke="#f97316" name="MTTR (h)" />
                            <Tooltip />
                            <Legend wrapperStyle={{paddingTop: '20px'}}/>
                            <Line yAxisId="left" type="monotone" dataKey="mtbf" name="MTBF (h)" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                            <Line yAxisId="right" type="monotone" dataKey="mttr" name="MTTR (h)" stroke="#f97316" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
