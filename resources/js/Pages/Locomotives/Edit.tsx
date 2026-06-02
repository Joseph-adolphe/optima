import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import PhotoUpload from '@/Components/Locomotives/PhotoUpload';
import { Locomotive } from '@/types/locomotive';
import { FormEvent } from 'react';

interface Categorie {
    id: number;
    nom: string;
}

interface MaintenanceCycle {
    id: number;
    nom: string;
}

interface Props {
    locomotive: Locomotive;
    categories: Categorie[];
    cycles: MaintenanceCycle[];
}

export default function Edit({ locomotive, categories, cycles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: locomotive.name,
        categorie_id: locomotive.categorie_id ?? '',
        maintenance_cycle_id: locomotive.maintenance_cycle_id ?? '',
        kilometrage_actuel: locomotive.kilometrage_actuel ?? '',
        commissioned_at: locomotive.commissioned_at ? locomotive.commissioned_at.split('T')[0] : '',
        photo: null as File | null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('locomotives.update', locomotive.id));
    };

    return (
        <AppLayout>
            <Head title={`Éditer ${locomotive.name} - OPTIMA ONE`} />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center">
                        <Link href={route('locomotives.show', locomotive.id)} className="text-slate-500 hover:text-slate-700 flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Éditer la locomotive {locomotive.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Numéro / Nom <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? "border-red-500" : ""}
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="categorie_id">Catégorie <span className="text-red-500">*</span></Label>
                                        <select
                                            id="categorie_id"
                                            value={data.categorie_id}
                                            onChange={(e) => setData('categorie_id', e.target.value)}
                                            className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.categorie_id ? 'border-red-500' : 'border-input'}`}
                                        >
                                            <option value="">-- Sélectionner une catégorie --</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                            ))}
                                        </select>
                                        {errors.categorie_id && <p className="text-sm text-red-500">{errors.categorie_id}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="maintenance_cycle_id">Cycle de Maintenance</Label>
                                        <select
                                            id="maintenance_cycle_id"
                                            value={data.maintenance_cycle_id}
                                            onChange={(e) => setData('maintenance_cycle_id', e.target.value)}
                                            className={`w-full rounded-md border px-3 py-2 text-sm bg-background ${errors.maintenance_cycle_id ? 'border-red-500' : 'border-input'}`}
                                        >
                                            <option value="">-- Aucun cycle --</option>
                                            {cycles?.map(cycle => (
                                                <option key={cycle.id} value={cycle.id}>{cycle.nom}</option>
                                            ))}
                                        </select>
                                        {errors.maintenance_cycle_id && <p className="text-sm text-red-500">{errors.maintenance_cycle_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kilometrage_actuel">Kilométrage Actuel</Label>
                                        <Input
                                            id="kilometrage_actuel"
                                            type="number"
                                            min="0"
                                            value={data.kilometrage_actuel}
                                            onChange={(e) => setData('kilometrage_actuel', e.target.value)}
                                            placeholder="Ex: 50000"
                                            className={errors.kilometrage_actuel ? "border-red-500" : ""}
                                        />
                                        {errors.kilometrage_actuel && <p className="text-sm text-red-500">{errors.kilometrage_actuel}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="commissioned_at">Date de mise en service <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="commissioned_at"
                                        type="date"
                                        value={data.commissioned_at}
                                        max={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setData('commissioned_at', e.target.value)}
                                        className={errors.commissioned_at ? "border-red-500 max-w-xs" : "max-w-xs"}
                                    />
                                    {errors.commissioned_at && <p className="text-sm text-red-500">{errors.commissioned_at}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Photo</Label>
                                    <p className="text-xs text-slate-500 mb-2">Laissez vide pour conserver la photo actuelle.</p>
                                    <PhotoUpload 
                                        currentPhotoUrl={locomotive.photo_url}
                                        onPhotoSelected={(f) => setData('photo', f)} 
                                        error={errors.photo}
                                    />
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t">
                                    <Link href={route('locomotives.show', locomotive.id)}>
                                        <Button type="button" variant="outline">Annuler</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="w-4 h-4 mr-2" /> Enregistrer
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
