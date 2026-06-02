import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { ClipboardList, Calendar, Activity, Play, CheckCircle, XCircle } from 'lucide-react';

interface Locomotive {
    id: number;
    name: string;
    model: string;
    kilometrage_actuel: number;
}

interface MaintenanceRule {
    id: number;
    nom: string;
    type: 'calendaire' | 'kilometrique';
    intervalle: number;
}

interface OrdreTravail {
    id: number;
    locomotive_id: number;
    maintenance_rule_id: number;
    statut: 'en_attente' | 'en_cours' | 'termine' | 'annule';
    date_prevue: string | null;
    kilometrage_prevu: number | null;
    locomotive: Locomotive;
    rule: MaintenanceRule;
}

interface Props {
    ordres: OrdreTravail[];
}

export default function OrdresTravailIndex({ ordres }: Props) {
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleUpdateStatut = (id: number, statut: string) => {
        setProcessingId(id);
        router.put(route('ordres-travail.updateStatut', id), { statut }, {
            preserveScroll: true,
            onFinish: () => setProcessingId(null),
        });
    };

    const getStatusBadge = (statut: string) => {
        switch (statut) {
            case 'en_attente':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
            case 'en_cours':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
            case 'termine':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Terminé</Badge>;
            case 'annule':
                return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Annulé</Badge>;
            default:
                return <Badge variant="outline">{statut}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Ordres de Travail - OPTIMA ONE" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                                <ClipboardList className="w-6 h-6 text-blue-600" />
                                Ordres de Travail (Préventif)
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Consultez les interventions de maintenance générées automatiquement par le système.
                            </p>
                        </div>
                    </div>

                    <Card className="shadow-lg border-slate-200">
                        <CardHeader className="bg-slate-50/50 border-b">
                            <CardTitle>Liste des interventions prévues</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Locomotive</TableHead>
                                        <TableHead>Intervention (Règle)</TableHead>
                                        <TableHead>Échéance</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ordres.length > 0 ? (
                                        ordres.map(ot => (
                                            <TableRow key={ot.id}>
                                                <TableCell className="font-medium text-slate-900">
                                                    {ot.locomotive.name} <span className="text-xs text-slate-500">({ot.locomotive.model})</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">{ot.rule.nom}</span>
                                                        <Badge variant="outline" className="text-[10px] bg-slate-50">
                                                            {ot.rule.type === 'calendaire' ? 'Calendaire' : 'Kilométrique'}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {ot.rule.type === 'calendaire' && ot.date_prevue ? (
                                                        <div className="flex items-center gap-1.5 text-slate-700">
                                                            <Calendar className="w-4 h-4 text-orange-500" />
                                                            {new Date(ot.date_prevue).toLocaleDateString()}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-slate-700">
                                                            <Activity className="w-4 h-4 text-orange-500" />
                                                            {ot.kilometrage_prevu} km
                                                            <span className="text-xs text-slate-400 ml-1">
                                                                (Actuel: {ot.locomotive.kilometrage_actuel})
                                                            </span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(ot.statut)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {ot.statut === 'en_attente' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleUpdateStatut(ot.id, 'en_cours')}
                                                            disabled={processingId === ot.id}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        >
                                                            <Play className="w-4 h-4 mr-1" />
                                                            Démarrer
                                                        </Button>
                                                    )}
                                                    {ot.statut === 'en_cours' && (
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUpdateStatut(ot.id, 'termine')}
                                                                disabled={processingId === ot.id}
                                                                className="text-green-600 border-green-200 hover:bg-green-50"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Terminer
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUpdateStatut(ot.id, 'annule')}
                                                                disabled={processingId === ot.id}
                                                                className="text-slate-500 border-slate-200 hover:bg-slate-50"
                                                            >
                                                                <XCircle className="w-4 h-4 mr-1" />
                                                                Annuler
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                                                Aucun ordre de travail pour le moment.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AppLayout>
    );
}
