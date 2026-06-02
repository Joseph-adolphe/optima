import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEvent } from 'react';

interface Props {
    locomotives: any[];
    preselectedLoco: any | null;
}

export default function Create({ locomotives, preselectedLoco }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        locomotive_id: preselectedLoco ? preselectedLoco.id : '',
        type: 'corrective',
        status: 'en_cours',
        description: '',
        failed_at: new Date().toISOString().split('T')[0],
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('pannes.store'));
    };

    return (
        <AppLayout>
            <Head title="Signaler une panne - OPTIMA ONE" />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center">
                        <Link href={route('pannes.index')} className="text-slate-500 hover:text-slate-700 flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Retour au suivi
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Signaler une intervention / panne</CardTitle>
                            <CardDescription>
                                Créez un nouveau dossier d'intervention. Si la maintenance est déjà terminée, 
                                vous pourrez renseigner les 4 fiches de suivi à l'étape suivante.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="locomotive_id">Locomotive</Label>
                                        <select
                                            id="locomotive_id"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={data.locomotive_id}
                                            onChange={(e) => setData('locomotive_id', e.target.value)}
                                        >
                                            <option value="" disabled>Sélectionnez une locomotive</option>
                                            {locomotives.map((l) => (
                                                <option key={l.id} value={l.id}>
                                                    {l.name} ({l.model})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.locomotive_id && <p className="text-sm text-red-500">{errors.locomotive_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type d'intervention</Label>
                                        <select
                                            id="type"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value as any)}
                                        >
                                            <option value="corrective">Corrective (Panne imprévue)</option>
                                            <option value="preventive">Préventive (Maintenance programmée)</option>
                                        </select>
                                        {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="failed_at">Date de survenue / de début</Label>
                                    <Input
                                        id="failed_at"
                                        type="date"
                                        value={data.failed_at}
                                        max={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setData('failed_at', e.target.value)}
                                        className={errors.failed_at ? "border-red-500 max-w-xs" : "max-w-xs"}
                                    />
                                    {errors.failed_at && <p className="text-sm text-red-500">{errors.failed_at}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Statut actuel</Label>
                                    <div className="flex gap-4 border border-slate-200 p-2 rounded-md">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                value="en_cours" 
                                                checked={data.status === 'en_cours'}
                                                onChange={(e) => setData('status', e.target.value as any)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span>En cours</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                value="terminee" 
                                                checked={data.status === 'terminee'}
                                                onChange={(e) => setData('status', e.target.value as any)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span>Déjà terminée (Saisie a posteriori)</span>
                                        </label>
                                    </div>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description / Symptômes initiaux</Label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="Décrivez brièvement le problème..."
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t">
                                    <Link href={route('pannes.index')}>
                                        <Button type="button" variant="outline">Annuler</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="w-4 h-4 mr-2" /> 
                                        {data.status === 'terminee' ? 'Créer et passer aux fiches' : 'Ouvrir le dossier'}
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
