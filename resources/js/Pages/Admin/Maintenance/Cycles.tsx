import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Plus, Pencil, Trash2, Calendar, Settings, Activity } from 'lucide-react';

interface MaintenanceRule {
    id: number;
    maintenance_cycle_id: number;
    nom: string;
    type: 'calendaire' | 'kilometrique';
    intervalle: number;
    seuil_alerte: number;
}

interface MaintenanceCycle {
    id: number;
    nom: string;
    description: string;
    rules: MaintenanceRule[];
}

interface Props {
    cycles: MaintenanceCycle[];
}

export default function MaintenanceCycles({ cycles }: Props) {
    const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<MaintenanceCycle | null>(null);
    const [selectedRule, setSelectedRule] = useState<MaintenanceRule | null>(null);

    const cycleForm = useForm({
        nom: '',
        description: '',
    });

    const ruleForm = useForm({
        nom: '',
        type: 'calendaire',
        intervalle: '',
        seuil_alerte: '',
    });

    // --- Cycle Actions ---
    const openCreateCycle = () => {
        cycleForm.reset();
        cycleForm.clearErrors();
        setSelectedCycle(null);
        setIsCycleModalOpen(true);
    };

    const openEditCycle = (cycle: MaintenanceCycle) => {
        cycleForm.clearErrors();
        cycleForm.setData({
            nom: cycle.nom,
            description: cycle.description || '',
        });
        setSelectedCycle(cycle);
        setIsCycleModalOpen(true);
    };

    const handleSaveCycle = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCycle) {
            cycleForm.put(route('admin.maintenance.cycles.update', selectedCycle.id), {
                onSuccess: () => setIsCycleModalOpen(false),
            });
        } else {
            cycleForm.post(route('admin.maintenance.cycles.store'), {
                onSuccess: () => setIsCycleModalOpen(false),
            });
        }
    };

    const handleDeleteCycle = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce cycle ?')) {
            cycleForm.delete(route('admin.maintenance.cycles.destroy', id));
        }
    };

    // --- Rule Actions ---
    const openCreateRule = (cycle: MaintenanceCycle) => {
        ruleForm.reset();
        ruleForm.clearErrors();
        setSelectedCycle(cycle);
        setSelectedRule(null);
        setIsRuleModalOpen(true);
    };

    const openEditRule = (rule: MaintenanceRule, cycle: MaintenanceCycle) => {
        ruleForm.clearErrors();
        ruleForm.setData({
            nom: rule.nom,
            type: rule.type,
            intervalle: rule.intervalle.toString(),
            seuil_alerte: rule.seuil_alerte.toString(),
        });
        setSelectedCycle(cycle);
        setSelectedRule(rule);
        setIsRuleModalOpen(true);
    };

    const handleSaveRule = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRule) {
            ruleForm.put(route('admin.maintenance.rules.update', selectedRule.id), {
                onSuccess: () => setIsRuleModalOpen(false),
            });
        } else if (selectedCycle) {
            ruleForm.post(route('admin.maintenance.rules.store', selectedCycle.id), {
                onSuccess: () => setIsRuleModalOpen(false),
            });
        }
    };

    const handleDeleteRule = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette règle ?')) {
            ruleForm.delete(route('admin.maintenance.rules.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Cycles & Règles de Maintenance - OPTIMA ONE" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                                <Settings className="w-6 h-6 text-blue-600" />
                                Cycles & Règles de Maintenance
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Définissez les différents cycles d'entretien et leurs règles périodiques (VA, VB, RG...).
                            </p>
                        </div>
                        <Button onClick={openCreateCycle} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau Cycle
                        </Button>
                    </div>

                    {cycles.length === 0 ? (
                        <Card className="border-dashed border-2 bg-slate-50/50">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Activity className="w-12 h-12 text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium">Aucun cycle de maintenance défini.</p>
                                <Button onClick={openCreateCycle} variant="outline" className="mt-4 border-blue-200 text-blue-600">
                                    Créer le premier cycle
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {cycles.map(cycle => (
                                <Card key={cycle.id} className="shadow-sm border-slate-200 overflow-hidden">
                                    <div className="bg-slate-50/80 border-b px-6 py-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">{cycle.nom}</h3>
                                            {cycle.description && <p className="text-sm text-slate-500 mt-0.5">{cycle.description}</p>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditCycle(cycle)}>
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDeleteCycle(cycle.id)} className="text-red-600 hover:bg-red-50 hover:border-red-200">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button size="sm" onClick={() => openCreateRule(cycle)} className="bg-slate-800 text-white ml-2">
                                                <Plus className="w-3.5 h-3.5 mr-1" /> Ajouter une règle
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="p-0">
                                        <Table>
                                            <TableHeader className="bg-slate-50/30">
                                                <TableRow>
                                                    <TableHead>Type d'intervention</TableHead>
                                                    <TableHead>Déclencheur</TableHead>
                                                    <TableHead>Intervalle</TableHead>
                                                    <TableHead>Seuil d'alerte</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {cycle.rules.length > 0 ? (
                                                    cycle.rules.map(rule => (
                                                        <TableRow key={rule.id}>
                                                            <TableCell className="font-semibold text-slate-800">
                                                                {rule.nom}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className={rule.type === 'calendaire' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'}>
                                                                    {rule.type === 'calendaire' ? (
                                                                        <><Calendar className="w-3 h-3 mr-1 inline" /> Calendaire</>
                                                                    ) : (
                                                                        <><Activity className="w-3 h-3 mr-1 inline" /> Kilométrique</>
                                                                    )}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {rule.intervalle} {rule.type === 'calendaire' ? 'jours' : 'km'}
                                                            </TableCell>
                                                            <TableCell className="text-slate-500">
                                                                {rule.seuil_alerte} {rule.type === 'calendaire' ? 'jours' : 'km'} avant
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button variant="ghost" size="sm" onClick={() => openEditRule(rule, cycle)}>
                                                                    <Pencil className="w-3.5 h-3.5 text-blue-600" />
                                                                </Button>
                                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                                                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-6 text-slate-400 italic">
                                                            Aucune règle définie pour ce cycle.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Cycle Modal */}
            <Dialog open={isCycleModalOpen} onOpenChange={setIsCycleModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedCycle ? 'Modifier le Cycle' : 'Nouveau Cycle'}</DialogTitle>
                        <DialogDescription>Définissez le nom du cycle de maintenance (ex: "Série Fret CC").</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveCycle} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nom du cycle</Label>
                            <Input
                                value={cycleForm.data.nom}
                                onChange={e => cycleForm.setData('nom', e.target.value)}
                                placeholder="Nom du cycle"
                                required
                            />
                            {cycleForm.errors.nom && <p className="text-red-500 text-xs">{cycleForm.errors.nom}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                value={cycleForm.data.description}
                                onChange={e => cycleForm.setData('description', e.target.value)}
                                placeholder="Description (optionnel)"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCycleModalOpen(false)}>Annuler</Button>
                            <Button type="submit" disabled={cycleForm.processing} className="bg-blue-600">Enregistrer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Rule Modal */}
            <Dialog open={isRuleModalOpen} onOpenChange={setIsRuleModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedRule ? 'Modifier la Règle' : 'Nouvelle Règle'}</DialogTitle>
                        <DialogDescription>Ajoutez une règle pour le cycle "{selectedCycle?.nom}".</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveRule} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nom de l'intervention (ex: VA, VB, RG)</Label>
                            <Input
                                value={ruleForm.data.nom}
                                onChange={e => ruleForm.setData('nom', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type de déclencheur</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={ruleForm.data.type}
                                onChange={e => ruleForm.setData('type', e.target.value as 'calendaire' | 'kilometrique')}
                            >
                                <option value="calendaire">Calendaire (Jours)</option>
                                <option value="kilometrique">Kilométrique (KM)</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Intervalle ({ruleForm.data.type === 'calendaire' ? 'jours' : 'km'})</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={ruleForm.data.intervalle}
                                    onChange={e => ruleForm.setData('intervalle', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Seuil d'alerte avant ({ruleForm.data.type === 'calendaire' ? 'jours' : 'km'})</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={ruleForm.data.seuil_alerte}
                                    onChange={e => ruleForm.setData('seuil_alerte', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                            Exemple : Un intervalle de 90 jours avec un seuil d'alerte de 7 jours générera un Ordre de Travail le 83ème jour, vous laissant 7 jours pour planifier l'intervention.
                        </p>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsRuleModalOpen(false)}>Annuler</Button>
                            <Button type="submit" disabled={ruleForm.processing} className="bg-blue-600">Enregistrer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}
