import { Fiche } from '@/types/fiche';
import { Card, CardContent } from '@/Components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';

interface Props {
    fiches: Fiche[];
}

export default function FicheTimeline({ fiches }: Props) {
    if (!fiches || fiches.length === 0) {
        return <div className="text-sm text-slate-500 py-4 text-center">Aucune fiche complétée.</div>;
    }

    const getFicheTitle = (step: number) => {
        switch (step) {
            case 1: return "Identification";
            case 2: return "Rapport d'intervention";
            case 3: return "Suivi des durées";
            case 4: return "Validation finale";
            default: return `Fiche ${step}`;
        }
    };

    return (
        <div className="relative border-l border-slate-200 ml-3 space-y-6 mt-4">
            {fiches.map((fiche) => (
                <div key={fiche.id} className="relative pl-6">
                    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-white border ring-4 ring-white border-blue-600 text-blue-600">
                        <CheckCircle className="w-4 h-4" />
                    </span>
                    
                    <Card className="shadow-sm border-slate-100">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-slate-900 text-sm">
                                    Étape {fiche.step} : {getFicheTitle(fiche.step)}
                                </h4>
                                <span className="text-xs text-slate-400 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(fiche.updated_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            
                            <div className="text-sm text-slate-600 space-y-2">
                                {fiche.step === 1 && (
                                    <>
                                        <p><strong>Composant :</strong> {fiche.payload.composant}</p>
                                        <p><strong>Défaut :</strong> {fiche.payload.type_defaut}</p>
                                    </>
                                )}
                                {fiche.step === 2 && (
                                    <>
                                        <p><strong>Technicien :</strong> {fiche.technician}</p>
                                        <p><strong>Actions :</strong> {fiche.payload.actions}</p>
                                    </>
                                )}
                                {fiche.step === 3 && (
                                    <>
                                        <p><strong>Durée :</strong> {Math.floor((fiche.repair_duration || 0) / 60)}h {(fiche.repair_duration || 0) % 60}m</p>
                                        <p className="text-xs text-slate-500">Du {new Date(fiche.started_at!).toLocaleString()} au {new Date(fiche.ended_at!).toLocaleString()}</p>
                                    </>
                                )}
                                {fiche.step === 4 && (
                                    <>
                                        <p><strong>Validé par :</strong> {fiche.payload.signature_chef}</p>
                                        <p><strong>Conforme :</strong> {fiche.payload.conforme ? 'Oui' : 'Non'}</p>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}
