import React from 'react';
import { Wrench, AlertTriangle, Play, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Link } from '@inertiajs/react';

export interface TimelineEvent {
    id: string;
    type: 'correctif' | 'preventif';
    title: string;
    date: string;
    status: string;
    description: string;
    link: string;
}

interface TimelineProps {
    events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
    if (!events || events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Clock className="w-10 h-10 mb-3 text-slate-300" />
                <p>Aucun historique disponible pour cette locomotive.</p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'terminee':
            case 'termine':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'en_cours':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'en_attente':
            case 'signalee':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'annule':
                return 'bg-slate-100 text-slate-700 border-slate-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-8 ml-4 mt-4">
            {events.map((event, index) => (
                <div key={event.id} className="relative group">
                    {/* Icon Bubble */}
                    <div className={`absolute -left-[42px] p-2 rounded-full border-2 bg-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm ${
                        event.type === 'preventif' ? 'border-blue-500 text-blue-600' : 'border-orange-500 text-orange-600'
                    }`}>
                        {event.type === 'preventif' ? (
                            <Wrench className="w-4 h-4" />
                        ) : (
                            <AlertTriangle className="w-4 h-4" />
                        )}
                    </div>

                    {/* Content Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 transition-all hover:shadow-md hover:border-slate-300">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-base font-semibold text-slate-900">{event.title}</h4>
                                    <Badge variant="outline" className={`text-xs ${
                                        event.type === 'preventif' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                                    }`}>
                                        {event.type === 'preventif' ? 'Préventif' : 'Correctif'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-600">{event.description}</p>
                            </div>
                            
                            <div className="flex flex-col sm:items-end gap-2">
                                <span className="text-sm font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {new Date(event.date).toLocaleDateString()}
                                </span>
                                <Badge className={getStatusColor(event.status)}>
                                    {event.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100">
                            <Link 
                                href={event.link} 
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                Voir les détails <Play className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
