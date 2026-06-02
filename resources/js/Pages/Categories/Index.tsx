import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Train, Plus, Edit, Trash2, ArrowRight } from 'lucide-react';

interface Categorie {
    id: number;
    nom: string;
    description: string | null;
    locomotives_count: number;
    created_at: string;
}

interface Props {
    categories: Categorie[];
}

export default function Index({ categories }: Props) {
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleDelete = (cat: Categorie) => {
        if (cat.locomotives_count > 0) return;
        if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${cat.nom}" ?`)) return;
        
        setDeleting(cat.id);
        router.delete(route('categories.destroy', cat.id), {
            onFinish: () => setDeleting(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Catégories - OPTIMA ONE" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Catégories de Locomotives
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Classifiez vos locomotives par type ou famille pour faciliter leur gestion.
                            </p>
                        </div>
                        
                        <Link href={route('categories.create')}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Nouvelle catégorie
                            </Button>
                        </Link>
                    </div>

                    {/* Grid */}
                    {categories.length === 0 ? (
                        <Card className="shadow-sm border-dashed border-2 border-slate-200 bg-slate-50">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Train className="w-16 h-16 text-slate-300 mb-4" />
                                <h3 className="text-xl font-semibold text-slate-700">Aucune catégorie</h3>
                                <p className="text-slate-500 mb-6 mt-1 text-center max-w-md">
                                    Vous n'avez pas encore créé de catégories. Commencez par créer votre première catégorie pour organiser votre parc de locomotives.
                                </p>
                                <Link href={route('categories.create')}>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Créer une catégorie
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {categories.map((cat) => (
                                <Card key={cat.id} className="shadow-sm border-slate-200 transition-all hover:shadow-md hover:border-blue-200 flex flex-col">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                                                    <Train className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold text-slate-900">
                                                        {cat.nom}
                                                    </CardTitle>
                                                    <div className="mt-1">
                                                        <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200">
                                                            {cat.locomotives_count} locomotive{cat.locomotives_count !== 1 ? 's' : ''}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="flex-1 pb-4">
                                        {cat.description ? (
                                            <p className="text-sm text-slate-600 line-clamp-3">
                                                {cat.description}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">
                                                Aucune description fournie.
                                            </p>
                                        )}
                                    </CardContent>
                                    
                                    <CardFooter className="pt-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex flex-wrap gap-2 justify-end">
                                        <Link href={route('locomotives.index', { categorie_id: cat.id })} className="mr-auto">
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                                                Voir le parc <ArrowRight className="w-4 h-4 ml-1.5" />
                                            </Button>
                                        </Link>
                                        
                                        <Link href={route('categories.edit', cat.id)}>
                                            <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-100">
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(cat)}
                                            disabled={cat.locomotives_count > 0 || deleting === cat.id}
                                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                                            title={cat.locomotives_count > 0 ? 'Impossible de supprimer : des locomotives sont liées à cette catégorie' : 'Supprimer'}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
