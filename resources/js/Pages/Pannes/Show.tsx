import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Panne } from '@/types/panne';
import { Fiche } from '@/types/fiche';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, Trash2, Train } from 'lucide-react';
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
import PanneStatusBadge from '@/Components/Pannes/PanneStatusBadge';
import PanneStepper from '@/Components/Pannes/PanneStepper';
import FicheTimeline from '@/Components/Pannes/FicheTimeline';

interface Props {
    panne: Panne;
    auth: any;
}

export default function Show({ panne, auth }: Props) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    const canManage = auth.user.role === 'chef_atelier';
    const isCompleted = panne.status === 'terminee';

    const handleDelete = () => {
        router.delete(route('pannes.destroy', panne.id), {
            onSuccess: () => setIsDeleteDialogOpen(false)
        });
    };

    return (
        <AppLayout>
            <Head title={`Panne #${panne.id} - OPTIMA ONE`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <Link href={route('pannes.index')} className="text-slate-500 hover:text-slate-700 flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Retour aux pannes
                        </Link>
                        
                        {canManage && (
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Supprimer ce dossier
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Êtes-vous sûr ?</DialogTitle>
                                        <DialogDescription>
                                            Cette action supprimera définitivement le dossier de panne 
                                            et toutes les fiches d'intervention associées.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="mt-4">
                                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
                                        <Button variant="destructive" onClick={handleDelete}>Confirmer la suppression</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Panne Details */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dossier de Panne</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500">Statut</dt>
                                            <dd className="mt-1"><PanneStatusBadge status={panne.status} /></dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500">Type d'intervention</dt>
                                            <dd className="mt-1 text-base text-slate-900 capitalize font-medium">
                                                {panne.type}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500">Date de survenue</dt>
                                            <dd className="mt-1 text-base text-slate-900">
                                                {new Date(panne.failed_at).toLocaleDateString('fr-FR')}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-slate-500">Symptômes / Description</dt>
                                            <dd className="mt-1 text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                                                {panne.description}
                                            </dd>
                                        </div>
                                    </dl>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Train className="w-4 h-4 text-slate-400" /> Locomotive concernée
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        {panne.locomotive?.photo_url ? (
                                            <img src={panne.locomotive.photo_url} className="w-16 h-16 rounded-md object-cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-md bg-slate-100 flex items-center justify-center">
                                                <Train className="w-8 h-8 text-slate-300" />
                                            </div>
                                        )}
                                        <div>
                                            <Link href={route('locomotives.show', panne.locomotive_id)} className="font-bold text-blue-600 hover:underline block">
                                                {panne.locomotive?.name}
                                            </Link>
                                            <span className="text-sm text-slate-500">{panne.locomotive?.model}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Fiches Stepper & Timeline */}
                        <div className="lg:col-span-2 space-y-6">
                            {!isCompleted && (
                                <PanneStepper 
                                    panne={panne} 
                                    fiches={panne.fiches || []} 
                                    canManage={canManage} 
                                />
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Historique des Fiches d'intervention</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FicheTimeline fiches={panne.fiches || []} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
