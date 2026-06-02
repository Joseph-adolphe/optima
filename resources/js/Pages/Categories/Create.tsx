import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <AppLayout>
            <Head title="Nouvelle catégorie - OPTIMA ONE" />
            
            <div className="py-6">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-6 flex items-center">
                        <Link href={route('categories.index')} className="text-slate-500 hover:text-slate-700 flex items-center text-sm font-medium">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Retour aux catégories
                        </Link>
                    </div>

                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-50/50 border-b">
                            <CardTitle className="text-xl">Nouvelle catégorie</CardTitle>
                            <CardDescription>
                                Définissez une catégorie pour regrouper vos locomotives
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmit}>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Nom de la catégorie <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="nom"
                                        type="text"
                                        value={data.nom}
                                        onChange={e => setData('nom', e.target.value)}
                                        className={errors.nom ? 'border-red-500' : ''}
                                        placeholder="Ex: Locomotives Diesel"
                                        autoFocus
                                    />
                                    {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                        <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500' : ''}`}
                                        placeholder="Description optionnelle de cette catégorie..."
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>
                            </CardContent>

                            <CardFooter className="bg-slate-50/50 border-t flex justify-end gap-3 pt-4 pb-4">
                                <Link href={route('categories.index')}>
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Save className="w-4 h-4 mr-2" />
                                    Créer la catégorie
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
