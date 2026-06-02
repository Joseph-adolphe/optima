import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Locomotive } from '@/types/locomotive';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Edit, Trash2, Train, Plus, History } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useState } from 'react';
import Timeline, { TimelineEvent } from '@/Components/Timeline';

interface Props {
    locomotive: Locomotive;
    recentPannes: any[];
    timeline: TimelineEvent[];
    auth: any;
}

export default function Show({ locomotive, recentPannes, timeline, auth }: Props) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    const canManage = auth.user.role === 'chef_atelier' || auth.user.role === 'directeur';

    const handleDelete = () => {
        router.delete(route('locomotives.destroy', locomotive.id), {
            onSuccess: () => setIsDeleteDialogOpen(false)
        });
    };

    return (
        <AppLayout>
            <Head title={`${locomotive.name} - OPTIMA ONE`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <Link href={route('locomotives.index')} className="text-slate-500 hover:text-slate-700 flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Retour au parc
                        </Link>
                        
                        {canManage && (
                            <div className="flex gap-2">
                                <Link href={route('locomotives.edit', locomotive.id)}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="w-4 h-4 mr-2" /> Éditer
                                    </Button>
                                </Link>
                                
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                                        <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Êtes-vous sûr ?</DialogTitle>
                                            <DialogDescription>
                                                Cette action est irréversible. Cela supprimera définitivement la locomotive 
                                                <span className="font-bold text-slate-900"> {locomotive.name}</span>, sa photo et toutes ses pannes associées.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="mt-4">
                                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
                                            <Button variant="destructive" onClick={handleDelete}>Confirmer la suppression</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Infos Locomotive */}
                        <div className="space-y-6">
                            <Card className="lg:col-span-1 shadow-sm border-slate-200">
                                <CardHeader className="bg-slate-50/50 border-b">
                                    <CardTitle>Détails de la locomotive</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="mb-6 rounded-lg overflow-hidden bg-slate-100 flex justify-center items-center h-48 border border-slate-200 shadow-inner">
                                        {locomotive.photo_url ? (
                                            <img src={locomotive.photo_url} alt={locomotive.name} className="object-cover w-full h-full" />
                                        ) : (
                                            <Train className="w-16 h-16 text-slate-300" />
                                        )}
                                    </div>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500">Nom / Numéro</dt>
                                            <dd className="mt-1 text-xl font-bold text-slate-900">{locomotive.name}</dd>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100">
                                            <dt className="text-sm font-medium text-slate-500">Catégorie</dt>
                                            <dd className="mt-1 text-base font-semibold text-slate-800">
                                                {locomotive.categorie?.nom ?? locomotive.model ?? '—'}
                                            </dd>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100">
                                            <dt className="text-sm font-medium text-slate-500">Mise en service</dt>
                                            <dd className="mt-1 text-base text-slate-900 flex items-center gap-2">
                                                {new Date(locomotive.commissioned_at).toLocaleDateString('fr-FR')}
                                            </dd>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100">
                                            <dt className="text-sm font-medium text-slate-500">Total Pannes</dt>
                                            <dd className="mt-1">
                                                <Badge variant={locomotive.pannes_count && locomotive.pannes_count > 0 ? "destructive" : "default"} className={!locomotive.pannes_count ? "bg-emerald-500" : ""}>
                                                    {locomotive.pannes_count || 0}
                                                </Badge>
                                            </dd>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100">
                                            <dt className="text-sm font-medium text-slate-500">Kilométrage Actuel</dt>
                                            <dd className="mt-1 text-base font-bold text-blue-700">
                                                {locomotive.kilometrage_actuel?.toLocaleString('fr-FR') || 0} km
                                            </dd>
                                        </div>
                                    </dl>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Historique Timeline */}
                        <Card className="lg:col-span-2 shadow-sm border-slate-200">
                            <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <History className="w-5 h-5 text-slate-500" />
                                    Historique des interventions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Timeline events={timeline} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
