import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PaginatedLocomotives } from '@/types/locomotive';
import LocomotiveCard from '@/Components/Locomotives/LocomotiveCard';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface Categorie {
    id: number;
    nom: string;
}

interface Props {
    locomotives: PaginatedLocomotives;
    categories: Categorie[];
    filters: {
        search?: string;
        categorie_id?: string;
    };
    auth: any;
}

export default function Index({ locomotives, categories, filters, auth }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [categorieId, setCategorieId] = useState(filters.categorie_id || '');

    const applyFilters = useCallback((newSearch: string, newCatId: string) => {
        const timeoutId = setTimeout(() => {
            router.get(
                route('locomotives.index'),
                { search: newSearch, categorie_id: newCatId },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        const cleanup = applyFilters(search, categorieId);
        return cleanup;
    }, [search, categorieId, applyFilters]);

    const canCreate = auth.user.role === 'chef_atelier';

    return (
        <AppLayout>
            <Head title="Locomotives - OPTIMA ONE" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête récapitulatif & Filtres */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900 mb-1">Parc des Locomotives</h2>
                            <p className="text-sm text-slate-500">Gérez et suivez l'état de votre flotte d'équipements en temps réel.</p>
                        </div>
                        
                        {/* Filtres */}
                        <div className="flex w-full lg:w-auto items-center gap-3 flex-wrap">
                            {/* Filtre catégorie */}
                            <select
                                value={categorieId}
                                onChange={(e) => setCategorieId(e.target.value)}
                                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-blue-500 min-w-[160px]"
                            >
                                <option value="">Toutes catégories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                ))}
                            </select>

                            {/* Recherche */}
                            <div className="relative w-full sm:w-64 shrink-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher une locomotive..."
                                    className="pl-9 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            
                            {canCreate && (
                                <Link href={route('locomotives.create')} className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 h-10 transition-colors">
                                        <Plus className="mr-2 h-4 w-4" /> Ajouter
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {locomotives.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {locomotives.data.map((loco) => (
                                <LocomotiveCard key={loco.id} locomotive={loco} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                            <p className="text-slate-500">Aucune locomotive trouvée.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {locomotives.last_page > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {locomotives.links.map((link, k) => (
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
