import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PaginatedPannes } from '@/types/panne';
import PanneStatusBadge from '@/Components/Pannes/PanneStatusBadge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Plus, Search, Filter, Train, Wrench } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

interface Props {
    pannes: PaginatedPannes;
    locomotives: any[];
    filters: {
        locomotive_id?: string;
        type?: string;
        status?: string;
        from?: string;
        to?: string;
    };
    auth: any;
}

export default function Index({ pannes, locomotives, filters, auth }: Props) {
    const [searchState, setSearchState] = useState(filters);
    
    const canCreate = ['chef_atelier', 'coordinateur'].includes(auth.user.role);

    const applyFilters = () => {
        router.get(
            route('pannes.index'),
            searchState as any,
            { preserveState: true, preserveScroll: true }
        );
    };

    const resetFilters = () => {
        setSearchState({});
        router.get(route('pannes.index'));
    };

    return (
        <AppLayout>
            <Head title="Maintenance et Pannes - OPTIMA ONE" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
                            <Wrench className="w-6 h-6" /> Suivi des Pannes
                        </h2>
                        
                        {canCreate && (
                            <Link href={route('pannes.create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Signaler une panne
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6 flex flex-wrap gap-4 items-end">
                        <div className="space-y-1">
                            <Label>Locomotive</Label>
                            <select 
                                className="flex h-10 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={searchState.locomotive_id || ''}
                                onChange={e => setSearchState({...searchState, locomotive_id: e.target.value})}
                            >
                                <option value="">Toutes</option>
                                {locomotives.map(l => (
                                    <option key={l.id} value={l.id}>{l.name} ({l.model})</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="space-y-1">
                            <Label>Type</Label>
                            <select 
                                className="flex h-10 w-full md:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={searchState.type || ''}
                                onChange={e => setSearchState({...searchState, type: e.target.value})}
                            >
                                <option value="">Tous</option>
                                <option value="preventive">Préventive</option>
                                <option value="corrective">Corrective</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label>Statut</Label>
                            <select 
                                className="flex h-10 w-full md:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={searchState.status || ''}
                                onChange={e => setSearchState({...searchState, status: e.target.value})}
                            >
                                <option value="">Tous</option>
                                <option value="en_cours">En cours</option>
                                <option value="terminee">Terminée</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label>Depuis</Label>
                            <Input 
                                type="date" 
                                value={searchState.from || ''}
                                onChange={e => setSearchState({...searchState, from: e.target.value})}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Jusqu'au</Label>
                            <Input 
                                type="date" 
                                value={searchState.to || ''}
                                onChange={e => setSearchState({...searchState, to: e.target.value})}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={applyFilters} variant="secondary">Filtrer</Button>
                            <Button onClick={resetFilters} variant="ghost">Réinitialiser</Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Locomotive</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pannes.data.length > 0 ? (
                                    pannes.data.map((panne) => (
                                        <TableRow key={panne.id}>
                                            <TableCell>{new Date(panne.failed_at).toLocaleDateString('fr-FR')}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Train className="w-4 h-4 text-slate-400" />
                                                    <Link href={route('locomotives.show', panne.locomotive_id)} className="font-medium hover:underline text-blue-600">
                                                        {panne.locomotive?.name}
                                                    </Link>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${panne.type === 'preventive' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                                    {panne.type === 'preventive' ? 'Préventive' : 'Corrective'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <PanneStatusBadge status={panne.status} />
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate" title={panne.description}>
                                                {panne.description}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={route('pannes.show', panne.id)}>
                                                    <Button variant="outline" size="sm">Consulter</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                            Aucune panne trouvée avec ces critères.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {pannes.last_page > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {pannes.links.map((link, k) => (
                                <Link
                                    key={k}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 border rounded-md text-sm ${
                                        link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 hover:bg-slate-50'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
