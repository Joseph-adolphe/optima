import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function AvailabilityGauge({ availability }: { availability: number }) {
    const data = [{ name: 'Disponibilité', value: availability }];
    
    const getColor = (value: number) => {
        if (value >= 90) return '#22c55e'; // green-500
        if (value >= 70) return '#f97316'; // orange-500
        return '#ef4444'; // red-500
    };

    return (
        <Card className="col-span-full md:col-span-1">
            <CardHeader>
                <CardTitle>Disponibilité Globale</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                            cx="50%" cy="50%" 
                            innerRadius="70%" outerRadius="100%" 
                            barSize={20} 
                            data={data}
                            startAngle={180} endAngle={0}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar
                                background
                                dataKey="value"
                                cornerRadius={10}
                                fill={getColor(availability)}
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                        <span className="text-4xl font-bold">{availability}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
