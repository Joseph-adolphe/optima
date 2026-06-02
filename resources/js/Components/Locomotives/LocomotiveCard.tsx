import { Link } from '@inertiajs/react';
import { Locomotive } from '@/types/locomotive';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Train, ShieldAlert, CheckCircle2, MoreHorizontal, ChevronRight, Gauge } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface Props {
    locomotive: Locomotive;
}

export default function LocomotiveCard({ locomotive }: Props) {
    const hasPannes = locomotive.pannes_count && locomotive.pannes_count > 0;

    return (
        <Card className="group relative overflow-hidden flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            {/* Status Indicator Bar at Top */}
            <div className={`absolute top-0 left-0 w-full h-1 z-20 ${
                hasPannes ? 'bg-orange-500' : 'bg-emerald-500'
            }`} />

            <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                {locomotive.photo_url ? (
                    <img 
                        src={locomotive.photo_url} 
                        alt={locomotive.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <Train className="w-12 h-12" />
                    </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                    {hasPannes ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 text-xs font-semibold shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            {locomotive.pannes_count} panne{(locomotive.pannes_count ?? 0) > 1 ? 's' : ''}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            OK
                        </span>
                    )}
                </div>

                {/* Overlaid details */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent text-white z-10">
                    <h3 className="font-bold text-lg mb-0.5">{locomotive.name}</h3>
                    <p className="text-slate-200 text-xs font-medium uppercase">
                        {locomotive.categorie?.nom ?? locomotive.model ?? '—'}
                    </p>
                </div>
            </div>
            
            <CardContent className="p-5 flex-1 bg-white relative z-20">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-1">Mise en service</span>
                        <span className="text-sm font-medium text-slate-700">
                            {new Date(locomotive.commissioned_at).toLocaleDateString('fr-FR', {
                                year: 'numeric', month: 'short'
                            })}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-1">Kilométrage</span>
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                            <Gauge className="w-3.5 h-3.5 text-blue-500" />
                            {locomotive.kilometrage_actuel?.toLocaleString('fr-FR') || 0} km
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <Link href={route('locomotives.show', locomotive.id)} className="w-full">
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl group/btn">
                        Fiche complète
                        <ChevronRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
